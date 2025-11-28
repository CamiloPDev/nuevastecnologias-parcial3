const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const auth = require('../middleware/auth');

// GET - Obtener todos los servicios activos (público)
router.get('/', servicioController.getServicios);

// GET - Buscar servicios con filtros (público)
router.get('/buscar', servicioController.buscarServicios);

// GET - Obtener servicio por ID (público)
router.get('/:id', servicioController.obtenerServicioPorId);

// Rutas protegidas - requieren autenticación
router.post('/', auth, servicioController.crearServicio);
router.put('/:id', auth, servicioController.actualizarServicio);
router.delete('/:id', auth, servicioController.eliminarServicio);

module.exports = router;
