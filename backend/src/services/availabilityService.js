// src/services/availabilityService.js
const Cita = require("../models/Cita");

// Validar si una hora está libre para crear/reprogramar una cita
const validarDisponibilidad = async (especialistaId, fecha, horaInicio, horaFin, citaExcluida = null) => {
  const inicio = new Date(`${fecha}T${horaInicio}`);
  const fin = new Date(`${fecha}T${horaFin}`);

  // Buscar citas que se crucen
  const citas = await Cita.find({
    especialistaId,
    fecha,
    estado: { $in: ["Programada", "En curso"] },
    _id: { $ne: citaExcluida }, // Para reprogramar sin compararse con sí misma
  });

  for (let cita of citas) {
    const citaInicio = new Date(`${cita.fecha}T${cita.horaInicio}`);
    const citaFin = new Date(`${cita.fecha}T${cita.horaFin}`);

    const seCruza =
      (inicio >= citaInicio && inicio < citaFin) ||
      (fin > citaInicio && fin <= citaFin) ||
      (inicio <= citaInicio && fin >= citaFin);

    if (seCruza) return false;
  }

  return true;
};

module.exports = { validarDisponibilidad };
