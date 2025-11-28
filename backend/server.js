// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Leer variables de entorno desde .env
dotenv.config();

// Conexión a MongoDB
const connectDB = require("./src/config/db");

// Middleware de errores global
const errorMiddleware = require("./src/middlewares/errorMiddleware");

// Inicializar servidor Express
const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// --------------------------------------------
// RUTAS PRINCIPALES DE LA API
// --------------------------------------------

// Autenticación
app.use("/api/auth", require("./src/routes/authRoutes"));

// Recursos principales
app.use("/api/clientes", require("./src/routes/clienteRoutes"));
app.use("/api/servicios", require("./src/routes/servicioRoutes"));
app.use("/api/citas", require("./src/routes/citaRoutes"));
app.use("/api/pagos", require("./src/routes/pagoRoutes"));

// Reportes (crear si no existe)
try {
  app.use("/api/reportes", require("./src/routes/reporteRoutes"));
} catch (error) {
  console.log("⚠️  Ruta de reportes no encontrada, creando endpoint básico...");
  app.get("/api/reportes/dashboard", async (req, res) => {
    try {
      const Cita = require("./src/models/Cita");
      const Cliente = require("./src/models/Cliente");
      const Pago = require("./src/models/Pago");
      
      const hoy = new Date();
      const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
      const finDia = new Date(hoy.setHours(23, 59, 59, 999));
      
      const citasHoy = await Cita.countDocuments({
        fecha: { $gte: inicioDia, $lte: finDia }
      });
      
      const citasPendientes = await Cita.countDocuments({
        fecha: { $gte: inicioDia, $lte: finDia },
        estado: 'pendiente'
      });
      
      const totalClientes = await Cliente.countDocuments();
      
      const pagosHoy = await Pago.find({
        fecha: { $gte: inicioDia, $lte: finDia },
        estado: 'completado'
      });
      
      const ingresosHoy = pagosHoy.reduce((sum, pago) => sum + pago.monto, 0);
      const ocupacion = citasHoy > 0 ? Math.round((citasHoy / 15) * 100) : 0;
      
      res.json({
        citasHoy,
        citasPendientes,
        totalClientes,
        ingresosHoy,
        ocupacion
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
    }
  });
}

// --------------------------------------------
// RUTA DE PRUEBA PRINCIPAL
// --------------------------------------------
app.get("/", (req, res) => {
  res.json({
    mensaje: "✅ API Nails Studio funcionando correctamente 🟣💅",
    version: "2.0.0",
    status: "online",
    database: "MongoDB Atlas"
  });
});

// --------------------------------------------
// ERROR 404 (ruta no encontrada)
// --------------------------------------------
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// --------------------------------------------
// MIDDLEWARE GLOBAL DE ERRORES
// --------------------------------------------
app.use(errorMiddleware);

// Puerto de ejecución
const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📍 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
