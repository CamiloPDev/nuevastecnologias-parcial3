const express = require('express');
const router = express.Router();
const Pago = require('../models/Pago');
const Cita = require('../models/Cita');

// GET - Obtener todos los pagos
router.get('/', async (req, res) => {
  try {
    const pagos = await Pago.find()
      .populate({
        path: 'cita',
        populate: { path: 'cliente', select: 'nombre apellido' }
      })
      .sort({ fecha: -1 });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pagos', error: error.message });
  }
});

// GET - Obtener pagos por rango de fechas
router.get('/rango/:inicio/:fin', async (req, res) => {
  try {
    const inicio = new Date(req.params.inicio);
    const fin = new Date(req.params.fin);
    fin.setHours(23, 59, 59, 999);
    
    const pagos = await Pago.find({
      fecha: { $gte: inicio, $lte: fin }
    })
      .populate({
        path: 'cita',
        populate: { path: 'cliente', select: 'nombre apellido' }
      })
      .sort({ fecha: -1 });
    
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pagos', error: error.message });
  }
});

// POST - Registrar nuevo pago
router.post('/', async (req, res) => {
  try {
    const nuevoPago = new Pago(req.body);
    const pagoGuardado = await nuevoPago.save();
    
    // Actualizar estado de la cita a completada
    await Cita.findByIdAndUpdate(req.body.cita, { estado: 'completada' });
    
    const pagoCompleto = await Pago.findById(pagoGuardado._id)
      .populate({
        path: 'cita',
        populate: { path: 'cliente', select: 'nombre apellido' }
      });
    
    res.status(201).json(pagoCompleto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar pago', error: error.message });
  }
});

module.exports = router;
