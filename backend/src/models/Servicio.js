// src/models/Servicio.js
const mongoose = require("mongoose");

const ServicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    descripcion: {
      type: String,
      default: ""
    },
    categoria: {
      type: String,
      required: true,
      trim: true
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    duracion: {
      type: Number, // minutos
      required: true,
      min: 1
    },
    activo: {
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

module.exports = mongoose.model("Servicio", ServicioSchema);
