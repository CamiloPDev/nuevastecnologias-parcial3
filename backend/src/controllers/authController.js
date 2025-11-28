// src/controllers/authController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc Iniciar sesión del administrador
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    console.log('🔍 Intento de login:', { correo, password: '***' });

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({ msg: "Correo y contraseña son requeridos" });
    }

    // Buscar admin por correo
    const admin = await Admin.findOne({ correo });

    console.log('👤 Admin encontrado:', admin ? 'SÍ' : 'NO');
    if (admin) {
      console.log('📧 Correo en DB:', admin.correo);
      console.log('🔐 Hash en DB:', admin.password.substring(0, 20) + '...');
    }

    if (!admin) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, admin.password);

    console.log('🔑 Contraseña coincide:', passwordMatch ? 'SÍ' : 'NO');

    if (!passwordMatch) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    // Crear token
    const token = jwt.sign(
      { id: admin._id, rol: admin.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      msg: "Inicio de sesión exitoso",
      token,
      admin: {
        id: admin._id,
        nombreCompleto: admin.nombreCompleto,
        correo: admin.correo,
        telefono: admin.telefono,
        rol: admin.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Validar token del administrador (mantener sesión)
 * @route GET /api/auth/verify
 * @access Private
 */
exports.verifyToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    res.json({
      msg: "Token válido",
      admin
    });

  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
