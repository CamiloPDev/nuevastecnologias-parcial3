// src/models/Cliente.js
const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: true,
      trim: true
    },
    alias: {
      type: String,
      default: "",
      trim: true
    },
    cedula: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    telefono: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      default: "",
      trim: true,
      lowercase: true
    },
    fechaRegistro: {
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

module.exports = mongoose.model("Cliente", ClienteSchema);
