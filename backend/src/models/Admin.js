// src/models/Admin.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    telefono: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    rol: {
      type: String,
      enum: ["admin"],
      default: "admin"
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

module.exports = mongoose.model("Admin", AdminSchema, "administradores");
