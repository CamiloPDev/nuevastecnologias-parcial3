// src/routes/configRoutes.js
const express = require("express");
const router = express.Router();

const {
  obtenerConfig,
  actualizarConfig
} = require("../controllers/configController");

const authMiddleware = require("../middlewares/authMiddleware");

// Obtener configuración global
router.get("/", authMiddleware, obtenerConfig);

// Actualizar configuración global
router.put("/", authMiddleware, actualizarConfig);

module.exports = router;
