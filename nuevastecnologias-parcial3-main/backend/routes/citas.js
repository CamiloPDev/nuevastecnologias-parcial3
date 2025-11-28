const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const auth = require('../middleware/auth');

// Todas las rutas de citas requieren autenticación
router.use(auth);

// POST - Crear nueva cita
router.post('/', citaController.crearCita);

// GET - Listar todas las citas
router.get('/', citaController.listarCitas);

// GET - Listar citas por fecha
router.get('/fecha/:fecha', citaController.listarCitasPorFecha);

// GET - Listar citas por cliente
router.get('/cliente/:clienteId', citaController.listarCitasPorCliente);

// GET - Obtener cita por ID
router.get('/:id', citaController.obtenerCitaPorId);

// PUT - Actualizar estado de cita
router.put('/:id/estado', citaController.actualizarEstadoCita);

// DELETE - Cancelar cita
router.delete('/:id', citaController.cancelarCita);

module.exports = router;
