// src/controllers/adminController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc Obtener perfil del administrador autenticado
 * @route GET /api/admin/profile
 * @access Private (solo admin)
*/
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Error al obtener perfil de admin:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Actualizar información del administrador
 * @route PUT /api/admin/update
 * @access Private
*/
exports.updateAdmin = async (req, res) => {
  try {
    const { nombreCompleto, telefono, correo } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    admin.nombreCompleto = nombreCompleto || admin.nombreCompleto;
    admin.telefono = telefono || admin.telefono;
    admin.correo = correo || admin.correo;

    await admin.save();

    res.json({
      msg: "Administrador actualizado correctamente",
      admin
    });
  } catch (error) {
    console.error("Error al actualizar admin:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Cambiar contraseña del administrador
 * @route PUT /api/admin/change-password
 * @access Private
*/
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Validar contraseña anterior
    const passwordMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: "La contraseña anterior es incorrecta" });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Crear administrador (solo desarrollo)
 * @route POST /api/admin/create
 * @access Public / se puede proteger luego
*/
exports.createAdmin = async (req, res) => {
  try {
    const { nombreCompleto, correo, telefono, password } = req.body;

    const exists = await Admin.findOne({ correo });

    if (exists) {
      return res.status(400).json({ msg: "Este correo ya está registrado" });
    }

    // Hash del password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      nombreCompleto,
      correo,
      telefono,
      password: hashedPassword,
      rol: "admin",
    });

    res.json({
      msg: "Administrador creado correctamente",
      admin: {
        id: admin._id,
        nombreCompleto: admin.nombreCompleto,
        correo: admin.correo,
        telefono: admin.telefono
      }
    });
  } catch (error) {
    console.error("Error al crear administrador:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
