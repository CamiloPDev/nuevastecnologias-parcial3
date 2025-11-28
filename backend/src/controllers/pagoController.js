// src/controllers/pagoController.js
const Pago = require("../models/Pago");
const Cita = require("../models/Cita");
const Cliente = require("../models/Cliente");

/**
 * @desc Registrar un pago de una cita
 * @route POST /api/pagos
 * @access Private
 */
exports.registrarPago = async (req, res) => {
  try {
    const { citaId, clienteId, metodoPago, monto } = req.body;

    if (!citaId || !clienteId || !metodoPago || !monto) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Verificar cita
    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    // Verificar cliente
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    // Registrar pago
    const pago = await Pago.create({
      citaId,
      clienteId,
      metodoPago,
      monto,
      fechaPago: new Date(),
      estado: "Pagado",
      creadoEn: new Date()
    });

    // Cambiar estado de la cita a finalizada si aún no lo está
    if (cita.estado !== "Finalizada") {
      cita.estado = "Finalizada";
      cita.actualizadoEn = new Date();
      await cita.save();
    }

    res.json({
      msg: "Pago registrado correctamente",
      pago
    });

  } catch (error) {
    console.error("Error al registrar pago:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener todos los pagos
 * @route GET /api/pagos
 * @access Private
 */
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find()
      .populate("clienteId", "nombre apellido telefono")
      .populate("citaId")
      .sort({ fechaPago: -1 });

    res.json(pagos);

  } catch (error) {
    console.error("Error al obtener pagos:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener pagos por cliente
 * @route GET /api/pagos/cliente/:clienteId
 * @access Private
 */
exports.pagosPorCliente = async (req, res) => {
  try {
    const pagos = await Pago.find({
      clienteId: req.params.clienteId
    })
      .populate("citaId")
      .sort({ fechaPago: -1 });

    res.json(pagos);

  } catch (error) {
    console.error("Error al obtener pagos por cliente:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener pago por cita
 * @route GET /api/pagos/cita/:citaId
 * @access Private
 */
exports.pagoPorCita = async (req, res) => {
  try {
    const pago = await Pago.findOne({
      citaId: req.params.citaId
    }).populate("clienteId", "nombre apellido telefono");

    if (!pago) {
      return res.status(404).json({ msg: "No hay pago registrado para esta cita" });
    }

    res.json(pago);

  } catch (error) {
    console.error("Error al obtener pago por cita:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
