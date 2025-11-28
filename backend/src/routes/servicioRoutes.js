// src/routes/servicioRoutes.js
const express = require("express");
const router = express.Router();

const {
  crearServicio,
  obtenerServicios,
  obtenerServicioPorId,
  actualizarServicio,
  eliminarServicio,
  cambiarEstadoServicio
} = require("../controllers/servicioController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE SERVICIOS
// -------------------------------------------

// Todas las rutas requieren autenticación
router.post("/", authMiddleware, crearServicio);
router.get("/", authMiddleware, obtenerServicios);
router.get("/:id", authMiddleware, obtenerServicioPorId);
router.put("/:id", authMiddleware, actualizarServicio);
router.delete("/:id", authMiddleware, eliminarServicio);
router.patch("/:id/estado", authMiddleware, cambiarEstadoServicio);

module.exports = router;
