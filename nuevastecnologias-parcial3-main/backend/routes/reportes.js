const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');

// GET - Reporte de ingresos por rango de fechas
router.get('/ingresos/:inicio/:fin', async (req, res) => {
  try {
    const inicio = new Date(req.params.inicio);
    const fin = new Date(req.params.fin);
    fin.setHours(23, 59, 59, 999);
    
    const pagos = await Pago.find({
      fecha: { $gte: inicio, $lte: fin },
      estado: 'completado'
    });
    
    const totalIngresos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
    const pagosPorMetodo = pagos.reduce((acc, pago) => {
      acc[pago.metodoPago] = (acc[pago.metodoPago] || 0) + pago.monto;
      return acc;
    }, {});
    
    res.json({
      totalIngresos,
      cantidadPagos: pagos.length,
      pagosPorMetodo,
      promedioPorPago: pagos.length > 0 ? totalIngresos / pagos.length : 0
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar reporte', error: error.message });
  }
});

// GET - Servicios más vendidos
router.get('/servicios-populares/:inicio/:fin', async (req, res) => {
  try {
    const inicio = new Date(req.params.inicio);
    const fin = new Date(req.params.fin);
    fin.setHours(23, 59, 59, 999);
    
    const citas = await Cita.find({
      fecha: { $gte: inicio, $lte: fin },
      estado: { $in: ['completada', 'en_curso'] }
    });
    
    const serviciosContador = {};
    citas.forEach(cita => {
      cita.servicios.forEach(s => {
        if (!serviciosContador[s.nombre]) {
          serviciosContador[s.nombre] = { cantidad: 0, ingresos: 0 };
        }
        serviciosContador[s.nombre].cantidad++;
        serviciosContador[s.nombre].ingresos += s.precio;
      });
    });
    
    const serviciosOrdenados = Object.entries(serviciosContador)
      .map(([nombre, datos]) => ({ nombre, ...datos }))
      .sort((a, b) => b.cantidad - a.cantidad);
    
    res.json(serviciosOrdenados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar reporte', error: error.message });
  }
});

// GET - Clientes frecuentes
router.get('/clientes-frecuentes', async (req, res) => {
  try {
    const citas = await Cita.find({ estado: 'completada' })
      .populate('cliente', 'nombre apellido telefono');
    
    const clientesContador = {};
    citas.forEach(cita => {
      const clienteId = cita.cliente._id.toString();
      if (!clientesContador[clienteId]) {
        clientesContador[clienteId] = {
          cliente: cita.cliente,
          cantidadCitas: 0,
          totalGastado: 0
        };
      }
      clientesContador[clienteId].cantidadCitas++;
      clientesContador[clienteId].totalGastado += cita.precioTotal;
    });
    
    const clientesOrdenados = Object.values(clientesContador)
      .sort((a, b) => b.cantidadCitas - a.cantidadCitas)
      .slice(0, 10);
    
    res.json(clientesOrdenados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar reporte', error: error.message });
  }
});

// GET - Estadísticas del dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDia = new Date(hoy.setHours(23, 59, 59, 999));
    
    const citasHoy = await Cita.countDocuments({
      fecha: { $gte: inicioDia, $lte: finDia }
    });
    
    const citasPendientes = await Cita.countDocuments({
      fecha: { $gte: inicioDia, $lte: finDia },
      estado: 'pendiente'
    });
    
    const totalClientes = await Cliente.countDocuments();
    
    const pagosHoy = await Pago.find({
      fecha: { $gte: inicioDia, $lte: finDia },
      estado: 'completado'
    });
    
    const ingresosHoy = pagosHoy.reduce((sum, pago) => sum + pago.monto, 0);
    
    const ocupacion = citasHoy > 0 ? Math.round((citasHoy / 15) * 100) : 0;
    
    res.json({
      citasHoy,
      citasPendientes,
      totalClientes,
      ingresosHoy,
      ocupacion
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
  }
});

module.exports = router;
