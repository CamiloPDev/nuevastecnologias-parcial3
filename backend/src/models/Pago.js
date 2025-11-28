// src/models/Pago.js
const mongoose = require("mongoose");

const PagoSchema = new mongoose.Schema(
  {
    citaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cita",
      required: true
    },

    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true
    },

    metodoPago: {
      type: String,
      enum: ["efectivo", "transferencia", "nequi", "daviplata", "tarjeta", "otro"],
      required: true
    },

    monto: {
      type: Number,
      required: true,
      min: 0
    },

    fechaPago: {
      type: Date,
      default: Date.now
    },

    estado: {
      type: String,
      enum: ["Pagado", "Pendiente"],
      default: "Pagado"
    },

    creadoEn: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Pago", PagoSchema);
