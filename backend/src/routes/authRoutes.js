// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  login,
  verifyToken
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// -------------------------------------------
// RUTAS DE AUTENTICACIÓN
// -------------------------------------------

// Iniciar sesión
router.post("/login", login);

// Verificar token y mantener sesión activa
router.get("/verify", authMiddleware, verifyToken);

module.exports = router;
