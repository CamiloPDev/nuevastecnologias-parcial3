// src/config/logger.js
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),

  // Dónde se guardan los logs
  transports: [
    // Mostrar en consola (desarrollo)
    new transports.Console(),

    // Guardar en archivo
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" })
  ]
});

// Log para errores no capturados
process.on("uncaughtException", (err) => {
  logger.error("🔥 Excepción no controlada: %s", err.message, {
    stack: err.stack
  });
});

// Log para promesas rechazadas
process.on("unhandledRejection", (reason) => {
  logger.error("❌ Promesa rechazada: %s", reason);
});

module.exports = logger;
