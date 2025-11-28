// src/services/notificationService.js
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");
const Config = require("../models/Config");
const Cliente = require("../models/Cliente");

const enviarNotificacionCita = async (clienteId, mensaje) => {
  const config = await Config.findOne();
  const cliente = await Cliente.findById(clienteId);

  if (!cliente) return;

  // Notificación por correo
  if (config.notificacionesCorreo) {
    await sendEmail(cliente.correo, "Notificación de cita 💅", mensaje);
  }

  // Notificación por WhatsApp
  if (config.notificacionesWhatsApp) {
    await sendWhatsApp(cliente.telefono, mensaje);
  }
};

const enviarRecordatorio = async (cita) => {
  const mensaje = `✨ Recordatorio de cita ✨\n\nTienes una cita agendada el ${cita.fecha} a las ${cita.horaInicio}.`;

  await enviarNotificacionCita(cita.clienteId, mensaje);
};

const enviarConfirmacion = async (cita) => {
  const mensaje = `💅 Confirmación de cita 💅\n\nTu cita fue registrada para el ${cita.fecha} a las ${cita.horaInicio}. ¡Te esperamos!`;

  await enviarNotificacionCita(cita.clienteId, mensaje);
};

module.exports = {
  enviarNotificacionCita,
  enviarRecordatorio,
  enviarConfirmacion,
};
