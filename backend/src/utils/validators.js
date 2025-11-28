// src/utils/validators.js
const { body, param, query } = require("express-validator");

// ===============================
// VALIDACIONES PARA LOGIN
// ===============================
exports.loginValidator = [
  body("correo")
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Correo inválido"),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
];


// ===============================
// VALIDACIONES PARA CLIENTES
// ===============================
exports.clienteValidator = [
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio"),

  body("apellido")
    .notEmpty().withMessage("El apellido es obligatorio"),

  body("telefono")
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isMobilePhone().withMessage("Número de teléfono inválido"),

  body("correo")
    .optional()
    .isEmail().withMessage("Correo inválido"),

  body("cedula")
    .notEmpty().withMessage("La cédula es obligatoria"),
];


// ===============================
// VALIDACIONES PARA SERVICIOS
// ===============================
exports.servicioValidator = [
  body("nombre")
    .notEmpty().withMessage("El nombre del servicio es obligatorio"),

  body("descripcion")
    .notEmpty().withMessage("La descripción es obligatoria"),

  body("precio")
    .notEmpty().withMessage("El precio es obligatorio")
    .isFloat({ min: 0 }).withMessage("El precio debe ser mayor o igual a 0"),

  body("duracion")
    .notEmpty().withMessage("La duración es obligatoria")
    .isInt({ min: 1 }).withMessage("La duración debe ser mayor a 0"),
];


// ===============================
// VALIDACIONES PARA CITAS
// ===============================
exports.citaValidator = [
  body("clienteId")
    .notEmpty().withMessage("El cliente es obligatorio"),

  body("servicios")
    .isArray({ min: 1 }).withMessage("Debe seleccionar al menos un servicio"),

  body("fecha")
    .notEmpty().withMessage("La fecha es obligatoria"),

  body("horaInicio")
    .notEmpty().withMessage("La hora de inicio es obligatoria"),
];


// ===============================
// VALIDACIONES PARA PAGOS
// ===============================
exports.pagoValidator = [
  body("citaId")
    .notEmpty().withMessage("El ID de cita es obligatorio"),

  body("clienteId")
    .notEmpty().withMessage("El ID del cliente es obligatorio"),

  body("monto")
    .notEmpty().withMessage("El monto es obligatorio")
    .isFloat({ min: 0 }).withMessage("El monto debe ser válido"),

  body("metodoPago")
    .notEmpty().withMessage("El método de pago es obligatorio")
    .isIn(["efectivo", "transferencia", "nequi", "daviplata", "tarjeta", "otro"])
    .withMessage("Método de pago inválido"),
];


// ===============================
// VALIDACIÓN DE ID POR PARAMS
// ===============================
exports.idValidator = [
  param("id")
    .isMongoId().withMessage("ID inválido")
];


// ===============================
// VALIDACIÓN DE BÚSQUEDA
// ===============================
exports.buscarValidator = [
  query("query")
    .notEmpty().withMessage("Debe enviar un término de búsqueda")
];
