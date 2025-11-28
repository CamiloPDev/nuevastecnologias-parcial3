// src/routes/clienteRoutes.js
const express = require("express");
const router = express.Router();

const {
  crearCliente,
  obtenerClientes,
  buscarClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente
} = require("../controllers/clienteController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE CLIENTES
// -------------------------------------------

// Todas las rutas requieren autenticación
router.post("/", authMiddleware, crearCliente);
router.get("/", authMiddleware, obtenerClientes);
router.get("/buscar", authMiddleware, buscarClientes);
router.get("/:id", authMiddleware, obtenerClientePorId);
router.put("/:id", authMiddleware, actualizarCliente);
router.delete("/:id", authMiddleware, eliminarCliente);

module.exports = router;
