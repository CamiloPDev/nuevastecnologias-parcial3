// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("⏳ Conectando a MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🟢 MongoDB conectado exitosamente ✔");
    console.log(`📌 Base de datos: ${mongoose.connection.name}`);
    console.log(`🌍 Servidor: ${mongoose.connection.host}`);

  } catch (error) {
    console.error("🔴 Error al conectar a MongoDB:", error.message);

    // Si falla la conexión, mostrar el error completo
    console.error("Detalles:", error);

    // Terminar el proceso para evitar que el servidor quede corriendo sin BD
    process.exit(1);
  }
};

// Exportar la función para usar en server.js
module.exports = connectDB;
