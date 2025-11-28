const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const auth = require('../middleware/auth');

// Todas las rutas de pagos requieren autenticación
router.use(auth);

// POST - Registrar nuevo pago
router.post('/', pagoController.registrarPago);

// GET - Listar todos los pagos
router.get('/', pagoController.listarPagos);

// GET - Reporte de recaudación
router.get('/reportes/recaudacion', pagoController.reporteRecaudacion);

// GET - Obtener pago por ID
router.get('/:id', pagoController.obtenerPagoPorId);

module.exports = router;
