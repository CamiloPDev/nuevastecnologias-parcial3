// src/utils/calculateEndTime.js

/**
 * Calcula la hora fin de una cita basado en la hora de inicio y la duración total en minutos.
 * @param {string} horaInicio "HH:MM" formato 24h
 * @param {number} duracionTotal Duración en minutos (suma de servicios)
 * @returns {string} Hora fin en formato "HH:MM"
 */

function calculateEndTime(horaInicio, duracionTotal) {
  // Separar hora y minutos
  const [hora, minutos] = horaInicio.split(":").map(Number);

  // Crear un objeto Date (día cualquiera)
  const fecha = new Date();
  fecha.setHours(hora);
  fecha.setMinutes(minutos);

  // Sumar duración total
  fecha.setMinutes(fecha.getMinutes() + duracionTotal);

  // Formatear nuevamente a HH:MM
  const horaFin = fecha.getHours().toString().padStart(2, "0");
  const minutosFin = fecha.getMinutes().toString().padStart(2, "0");

  return `${horaFin}:${minutosFin}`;
}

module.exports = calculateEndTime;
