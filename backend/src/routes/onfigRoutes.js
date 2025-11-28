// src/routes/configRoutes.js
const express = require("express");
const router = express.Router();

const {
  obtenerConfig,
  actualizarConfig
} = require("../controllers/configController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE CONFIGURACIÓN GLOBAL
// -------------------------------------------

// Obtener configuración general del sistema
router.get("/", authMiddleware, obtenerConfig);

// Actualizar configuración (recordatorios, notificaciones, etc.)
router.put("/", authMiddleware, actualizarConfig);

module.exports = router;
