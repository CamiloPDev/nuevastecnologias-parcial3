const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// GET - Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ fechaRegistro: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
});

// GET - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
});

// GET - Buscar clientes por nombre, cédula o teléfono
router.get('/buscar/:termino', async (req, res) => {
  try {
    const termino = req.params.termino;
    const clientes = await Cliente.find({
      $or: [
        { nombre: { $regex: termino, $options: 'i' } },
        { apellido: { $regex: termino, $options: 'i' } },
        { cedula: { $regex: termino, $options: 'i' } },
        { telefono: { $regex: termino, $options: 'i' } }
      ]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la búsqueda', error: error.message });
  }
});

// POST - Crear nuevo cliente
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
  }
});

// PUT - Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    req.body.actualizadoEn = Date.now();
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar cliente', error: error.message });
  }
});

// DELETE - Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
});

module.exports = router;
