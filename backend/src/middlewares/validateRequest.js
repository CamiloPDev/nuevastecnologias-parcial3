// src/middlewares/validateRequest.js
const { validationResult } = require("express-validator");

// Middleware genérico para validar peticiones
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  // Si hay errores, se retornan
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Error de validación",
      errors: errors.array(),
    });
  }

  next();
};

module.exports = validateRequest;
