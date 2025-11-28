// src/utils/sendWhatsApp.js
const axios = require("axios");

/**
 * Envía un mensaje de WhatsApp usando un webhook de n8n
 * @param {string} telefono - Número en formato internacional (ej: 573001112233)
 * @param {string} mensaje - Mensaje de WhatsApp a enviar
 */
const sendWhatsApp = async (telefono, mensaje) => {
  try {
    // Verificar que el webhook exista
    if (!process.env.N8N_WHATSAPP_WEBHOOK) {
      console.log("❌ No se encontró N8N_WHATSAPP_WEBHOOK en .env");
      return;
    }

    // Datos enviados al flujo de n8n
    const payload = {
      telefono,
      mensaje,
    };

    // Llamar al webhook de n8n
    const response = await axios.post(
      process.env.N8N_WHATSAPP_WEBHOOK,
      payload
    );

    console.log("📨 WhatsApp enviado correctamente:", response.data);
    return true;

  } catch (error) {
    console.error("❌ Error enviando WhatsApp:", error.message);
    return false;
  }
};

module.exports = sendWhatsApp;
