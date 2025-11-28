// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateAdmin,
  changePassword,
  createAdmin,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DEL ADMINISTRADOR
// -------------------------------------------

// Obtener perfil del administrador logueado
router.get("/profile", authMiddleware, getProfile);

// Actualizar datos del administrador
router.put("/update", authMiddleware, updateAdmin);

// Cambiar contraseña
router.put("/change-password", authMiddleware, changePassword);

// Crear un nuevo administrador (solo para desarrollo)
// Puedes protegerla luego si quieres
router.post("/create", createAdmin);

module.exports = router;
