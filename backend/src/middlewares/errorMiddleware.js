// src/middlewares/errorMiddleware.js

// Middleware para manejo GLOBAL de errores
const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error capturado por errorMiddleware:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    msg: err.message || "Error en el servidor",
    status: "error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorMiddleware;
