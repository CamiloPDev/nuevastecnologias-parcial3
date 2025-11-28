const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middleware/auth');

// Todas las rutas de clientes requieren autenticación
router.use(auth);

// POST - Crear nuevo cliente
router.post('/', clienteController.crearCliente);

// GET - Listar todos los clientes (con paginación)
router.get('/', clienteController.listarClientes);

// GET - Buscar clientes
router.get('/buscar', clienteController.buscarClientes);

// GET - Obtener cliente por ID
router.get('/:id', clienteController.obtenerClientePorId);

// PUT - Actualizar cliente
router.put('/:id', clienteController.actualizarCliente);

// DELETE - Eliminar cliente
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;
