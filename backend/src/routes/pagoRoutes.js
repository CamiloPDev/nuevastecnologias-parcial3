// src/routes/pagoRoutes.js
const express = require("express");
const router = express.Router();

const {
  registrarPago,
  obtenerPagos,
  pagosPorCliente,
  pagoPorCita
} = require("../controllers/pagoController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE PAGOS
// -------------------------------------------

// Todas las rutas requieren autenticación
router.post("/", authMiddleware, registrarPago);
router.get("/", authMiddleware, obtenerPagos);
router.get("/cliente/:clienteId", authMiddleware, pagosPorCliente);
router.get("/cita/:citaId", authMiddleware, pagoPorCita);

module.exports = router;
