const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  cita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cita',
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'transferencia', 'nequi', 'tarjeta', 'otro'],
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'completado'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  notas: {
    type: String
  }
});

module.exports = mongoose.model('Pago', pagoSchema, 'pagos');
