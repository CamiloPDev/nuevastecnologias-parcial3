const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');

// GET - Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ categoria: 1, nombre: 1 });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicios', error: error.message });
  }
});

// GET - Obtener solo servicios activos
router.get('/activos', async (req, res) => {
  try {
    const servicios = await Servicio.find({ activo: true }).sort({ categoria: 1, nombre: 1 });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicios', error: error.message });
  }
});

// GET - Buscar servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicio', error: error.message });
  }
});

// POST - Crear nuevo servicio
router.post('/', async (req, res) => {
  try {
    const nuevoServicio = new Servicio(req.body);
    const servicioGuardado = await nuevoServicio.save();
    res.status(201).json(servicioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear servicio', error: error.message });
  }
});

// PUT - Actualizar servicio
router.put('/:id', async (req, res) => {
  try {
    req.body.actualizadoEn = Date.now();
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json(servicioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar servicio', error: error.message });
  }
});

// DELETE - Eliminar servicio (soft delete - marcar como inactivo)
router.delete('/:id', async (req, res) => {
  try {
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      req.params.id,
      { activo: false, actualizadoEn: Date.now() },
      { new: true }
    );
    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json({ mensaje: 'Servicio desactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar servicio', error: error.message });
  }
});

module.exports = router;
