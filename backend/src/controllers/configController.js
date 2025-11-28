// src/controllers/configController.js
const Config = require("../models/Config");

/**
 * @desc Obtener configuración global
 * @route GET /api/config
 * @access Private (admin)
 */
exports.obtenerConfig = async (req, res) => {
  try {
    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({ msg: "Configuración no encontrada" });
    }

    res.json(config);

  } catch (error) {
    console.error("Error al obtener configuración:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Actualizar configuración global (recordatorios, notificaciones, etc.)
 * @route PUT /api/config
 * @access Private (admin)
 */
exports.actualizarConfig = async (req, res) => {
  try {
    const { 
      recordatorioHorasAntes,
      notificacionesWhatsApp,
      notificacionesCorreo
    } = req.body;

    let config = await Config.findOne();

    if (!config) {
      // Si no existe un documento de config, lo creamos
      config = await Config.create({
        recordatorioHorasAntes: recordatorioHorasAntes || 24,
        notificacionesWhatsApp: notificacionesWhatsApp || false,
        notificacionesCorreo: notificacionesCorreo || false
      });

      return res.json({
        msg: "Configuración creada correctamente",
        config
      });
    }

    // Actualizar campos si vienen en el body
    if (recordatorioHorasAntes !== undefined) {
      config.recordatorioHorasAntes = recordatorioHorasAntes;
    }

    if (notificacionesWhatsApp !== undefined) {
      config.notificacionesWhatsApp = notificacionesWhatsApp;
    }

    if (notificacionesCorreo !== undefined) {
      config.notificacionesCorreo = notificacionesCorreo;
    }

    config.actualizadoEn = new Date();

    await config.save();

    res.json({
      msg: "Configuración actualizada correctamente",
      config
    });

  } catch (error) {
    console.error("Error al actualizar configuración:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
