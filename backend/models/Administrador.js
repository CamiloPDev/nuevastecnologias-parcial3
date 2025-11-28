const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
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
    required: true
  },
  rol: {
    type: String,
    default: 'admin'
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  actualizadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Administrador', administradorSchema, 'administradores');
