// src/models/Cita.js
const mongoose = require("mongoose");

const CitaSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true
    },

    especialistaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    servicios: [
      {
        servicioId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Servicio",
          required: true
        },
        nombre: { type: String, required: true },
        duracion: { type: Number, required: true }, // minutos
        precio: { type: Number, required: true }
      }
    ],

    duracionTotal: {
      type: Number, // minutos
      required: true
    },

    fecha: {
      type: String, // formato YYYY-MM-DD
      required: true
    },

    horaInicio: {
      type: String, // HH:mm
      required: true
    },

    horaFin: {
      type: String, // HH:mm
      required: true
    },

    estado: {
      type: String,
      enum: ["Programada", "En Curso", "Finalizada", "Cancelada"],
      default: "Programada"
    },

    notificacionEnviada: {
      type: Boolean,
      default: false
    },

    recordatorioEnviado: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Cita", CitaSchema);
