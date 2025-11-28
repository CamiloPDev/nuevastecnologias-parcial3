const express = require('express');
const router = express.Router();
const administradorController = require('../controllers/administradorController');
const auth = require('../middleware/auth');

// POST - Registrar nuevo administrador
router.post('/registrar', administradorController.registrar);

// POST - Login de administrador
router.post('/login', administradorController.login);

// GET - Obtener perfil (requiere autenticación)
router.get('/perfil', auth, administradorController.perfil);

module.exports = router;
