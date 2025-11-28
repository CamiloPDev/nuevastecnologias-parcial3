const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

// GET - Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('cliente', 'nombre apellido telefono')
      .populate('administrador', 'nombreCompleto')
      .sort({ fecha: -1, hora: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
});

// GET - Obtener citas por fecha
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    const inicioDia = new Date(fecha.setHours(0, 0, 0, 0));
    const finDia = new Date(fecha.setHours(23, 59, 59, 999));
    
    const citas = await Cita.find({
      fecha: { $gte: inicioDia, $lte: finDia }
    })
      .populate('cliente', 'nombre apellido telefono')
      .populate('administrador', 'nombreCompleto')
      .sort({ hora: 1 });
    
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
});

// GET - Obtener citas de hoy
router.get('/hoy', async (req, res) => {
  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDia = new Date(hoy.setHours(23, 59, 59, 999));
    
    const citas = await Cita.find({
      fecha: { $gte: inicioDia, $lte: finDia }
    })
      .populate('cliente', 'nombre apellido telefono')
      .populate('administrador', 'nombreCompleto')
      .sort({ hora: 1 });
    
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
});

// GET - Obtener citas por cliente
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const citas = await Cita.find({ cliente: req.params.clienteId })
      .populate('administrador', 'nombreCompleto')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
});

// GET - Verificar disponibilidad
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    const { fecha, hora, duracionTotal, citaId } = req.body;
    
    const fechaBusqueda = new Date(fecha);
    const inicioDia = new Date(fechaBusqueda.setHours(0, 0, 0, 0));
    const finDia = new Date(fechaBusqueda.setHours(23, 59, 59, 999));
    
    const query = {
      fecha: { $gte: inicioDia, $lte: finDia },
      estado: { $ne: 'cancelada' }
    };
    
    if (citaId) {
      query._id = { $ne: citaId };
    }
    
    const citasDelDia = await Cita.find(query);
    
    // Verificar conflictos de horario
    const [horaInicio, minutoInicio] = hora.split(':').map(Number);
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFin = minutosInicio + duracionTotal;
    
    const hayConflicto = citasDelDia.some(cita => {
      const [horaCita, minutoCita] = cita.hora.split(':').map(Number);
      const minutosCitaInicio = horaCita * 60 + minutoCita;
      const minutosCitaFin = minutosCitaInicio + cita.duracionTotal;
      
      return (
        (minutosInicio >= minutosCitaInicio && minutosInicio < minutosCitaFin) ||
        (minutosFin > minutosCitaInicio && minutosFin <= minutosCitaFin) ||
        (minutosInicio <= minutosCitaInicio && minutosFin >= minutosCitaFin)
      );
    });
    
    res.json({ disponible: !hayConflicto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar disponibilidad', error: error.message });
  }
});

// POST - Crear nueva cita
router.post('/', async (req, res) => {
  try {
    const { servicios: serviciosIds, ...datosCita } = req.body;
    
    // Obtener información completa de los servicios
    const serviciosCompletos = await Servicio.find({ _id: { $in: serviciosIds } });
    
    // Calcular duración y precio total
    let duracionTotal = 0;
    let precioTotal = 0;
    const serviciosParaCita = serviciosCompletos.map(s => {
      duracionTotal += s.duracion;
      precioTotal += s.precio;
      return {
        servicio: s._id,
        nombre: s.nombre,
        precio: s.precio,
        duracion: s.duracion
      };
    });
    
    const nuevaCita = new Cita({
      ...datosCita,
      servicios: serviciosParaCita,
      duracionTotal,
      precioTotal
    });
    
    const citaGuardada = await nuevaCita.save();
    const citaCompleta = await Cita.findById(citaGuardada._id)
      .populate('cliente', 'nombre apellido telefono')
      .populate('administrador', 'nombreCompleto');
    
    res.status(201).json(citaCompleta);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear cita', error: error.message });
  }
});

// PUT - Actualizar cita
router.put('/:id', async (req, res) => {
  try {
    const { servicios: serviciosIds, ...datosCita } = req.body;
    
    if (serviciosIds) {
      const serviciosCompletos = await Servicio.find({ _id: { $in: serviciosIds } });
      
      let duracionTotal = 0;
      let precioTotal = 0;
      const serviciosParaCita = serviciosCompletos.map(s => {
        duracionTotal += s.duracion;
        precioTotal += s.precio;
        return {
          servicio: s._id,
          nombre: s.nombre,
          precio: s.precio,
          duracion: s.duracion
        };
      });
      
      datosCita.servicios = serviciosParaCita;
      datosCita.duracionTotal = duracionTotal;
      datosCita.precioTotal = precioTotal;
    }
    
    datosCita.actualizadoEn = Date.now();
    
    const citaActualizada = await Cita.findByIdAndUpdate(
      req.params.id,
      datosCita,
      { new: true, runValidators: true }
    )
      .populate('cliente', 'nombre apellido telefono')
      .populate('administrador', 'nombreCompleto');
    
    if (!citaActualizada) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    
    res.json(citaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar cita', error: error.message });
  }
});

// DELETE - Cancelar cita
router.delete('/:id', async (req, res) => {
  try {
    const citaCancelada = await Cita.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada', actualizadoEn: Date.now() },
      { new: true }
    );
    
    if (!citaCancelada) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    
    res.json({ mensaje: 'Cita cancelada exitosamente', cita: citaCancelada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar cita', error: error.message });
  }
});

module.exports = router;
