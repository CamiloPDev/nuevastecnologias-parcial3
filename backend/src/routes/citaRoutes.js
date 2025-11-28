// src/routes/citaRoutes.js
const express = require("express");
const router = express.Router();

const {
  crearCita,
  obtenerCitas,
  citasDelDia,
  reprogramarCita,
  cancelarCita,
  finalizarCita,
  historialPorCliente
} = require("../controllers/citaController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE CITAS
// -------------------------------------------

// Todas las rutas requieren autenticación
router.post("/", authMiddleware, crearCita);
router.get("/", authMiddleware, obtenerCitas);
router.get("/dia/:fecha", authMiddleware, citasDelDia);
router.put("/:id/reprogramar", authMiddleware, reprogramarCita);
router.put("/:id/cancelar", authMiddleware, cancelarCita);
router.put("/:id/finalizar", authMiddleware, finalizarCita);
router.get("/historial/:clienteId", authMiddleware, historialPorCliente);

module.exports = router;
