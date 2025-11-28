// src/config/env.js
const dotenv = require("dotenv");

// Cargar archivo .env
dotenv.config();

// Validar que las variables necesarias existan
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "PORT"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ ERROR: La variable ${varName} no está definida en el archivo .env`);
    process.exit(1);
  }
});

// Exportar configuración
module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
