const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  administrador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrador',
    required: true
  },
  servicios: [{
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true
    },
    nombre: String,
    precio: Number,
    duracion: Number
  }],
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  duracionTotal: {
    type: Number,
    default: 0
  },
  precioTotal: {
    type: Number,
    default: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_curso', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  notas: {
    type: String
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

module.exports = mongoose.model('Cita', citaSchema, 'citas');
