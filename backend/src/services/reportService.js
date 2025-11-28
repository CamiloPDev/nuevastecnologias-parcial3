// src/services/reportService.js
const Pago = require("../models/Pago");
const Cita = require("../models/Cita");

const reporteVentas = async (fechaInicio, fechaFin) => {
  return await Pago.find({
    fechaPago: {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin),
    },
  });
};

const reporteCitas = async (fechaInicio, fechaFin) => {
  return await Cita.find({
    fecha: { $gte: fechaInicio, $lte: fechaFin },
  }).populate("clienteId servicios.servicioId");
};

const serviciosMasVendidos = async () => {
  const citas = await Cita.find({ estado: "Finalizada" });

  let contador = {};

  citas.forEach(cita => {
    cita.servicios.forEach(serv => {
      contador[serv.nombre] = (contador[serv.nombre] || 0) + 1;
    });
  });

  return contador;
};

const clientesFrecuentes = async () => {
  const citas = await Cita.find({ estado: "Finalizada" });

  let contador = {};

  citas.forEach(cita => {
    contador[cita.clienteId] = (contador[cita.clienteId] || 0) + 1;
  });

  return contador;
};

module.exports = {
  reporteVentas,
  reporteCitas,
  serviciosMasVendidos,
  clientesFrecuentes,
};
