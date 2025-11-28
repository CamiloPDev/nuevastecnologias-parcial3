// src/models/Config.js
const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema(
  {
    recordatorioHorasAntes: {
      type: Number,
      default: 24, // Enviar recordatorio 24h antes por defecto
      min: 1
    },

    notificacionesWhatsApp: {
      type: Boolean,
      default: true
    },

    notificacionesCorreo: {
      type: Boolean,
      default: true
    },

    creadoEn: {
      type: Date,
      default: Date.now
    },

    actualizadoEn: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Config", ConfigSchema);
