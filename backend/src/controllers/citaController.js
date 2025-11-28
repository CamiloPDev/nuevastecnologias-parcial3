// src/controllers/citaController.js
const Cita = require("../models/Cita");
const Cliente = require("../models/Cliente");
const Servicio = require("../models/Servicio");

/**
 * Función para calcular hora final
 */
function calcularHoraFin(horaInicio, duracionTotal) {
  const [horas, minutos] = horaInicio.split(":").map(Number);

  const inicio = new Date();
  inicio.setHours(horas);
  inicio.setMinutes(minutos);

  const fin = new Date(inicio.getTime() + duracionTotal * 60000);

  const hh = fin.getHours().toString().padStart(2, "0");
  const mm = fin.getMinutes().toString().padStart(2, "0");

  return `${hh}:${mm}`;
}

/**
 * Validar disponibilidad
 */
async function validarDisponibilidad(especialistaId, fecha, horaInicio, horaFin) {
  const conflicto = await Cita.findOne({
    especialistaId,
    fecha,
    estado: { $ne: "Cancelada" },
    $or: [
      {
        horaInicio: { $lte: horaInicio },
        horaFin: { $gt: horaInicio }
      },
      {
        horaInicio: { $lt: horaFin },
        horaFin: { $gte: horaFin }
      }
    ]
  });

  return conflicto ? false : true;
}

/**
 * @desc Crear una nueva cita
 * @route POST /api/citas
 * @access Private (solo admin)
 */
exports.crearCita = async (req, res) => {
  try {
    const { clienteId, serviciosSeleccionados, fecha, horaInicio } = req.body;

    if (!clienteId || !serviciosSeleccionados || !fecha || !horaInicio) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Verificar cliente
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    // Obtener servicios
    const serviciosDB = await Servicio.find({
      _id: { $in: serviciosSeleccionados }
    });

    if (serviciosDB.length === 0) {
      return res.status(400).json({ msg: "Servicios inválidos" });
    }

    // Calcular duración total
    const duracionTotal = serviciosDB.reduce((total, s) => total + s.duracion, 0);

    // Calcular hora fin
    const horaFin = calcularHoraFin(horaInicio, duracionTotal);

    // Validar disponibilidad del especialista (admin logueado)
    const especialistaId = req.admin.id;

    const disponible = await validarDisponibilidad(
      especialistaId,
      fecha,
      horaInicio,
      horaFin
    );

    if (!disponible) {
      return res.status(400).json({
        msg: "El especialista ya tiene una cita en ese horario"
      });
    }

    // Construcción del array de servicios para guardar
    const serviciosFormateados = serviciosDB.map((s) => ({
      servicioId: s._id,
      nombre: s.nombre,
      duracion: s.duracion,
      precio: s.precio
    }));

    // Crear cita
    const nuevaCita = await Cita.create({
      clienteId,
      servicios: serviciosFormateados,
      duracionTotal,
      especialistaId,
      fecha,
      horaInicio,
      horaFin,
      estado: "Programada",
      creadoEn: new Date(),
      actualizadoEn: new Date()
    });

    res.json({
      msg: "Cita creada correctamente",
      cita: nuevaCita
    });

  } catch (error) {
    console.error("Error al crear cita:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Obtener citas del día
 * @route GET /api/citas/dia/:fecha
 * @access Private
 */
exports.citasDelDia = async (req, res) => {
  try {
    const { fecha } = req.params;

    const citas = await Cita.find({ fecha }).sort({ horaInicio: 1 });

    res.json(citas);

  } catch (error) {
    console.error("Error al obtener citas del día:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Obtener todas las citas
 * @route GET /api/citas
 * @access Private
 */
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().sort({ fecha: -1, horaInicio: 1 });
    res.json(citas);
  } catch (error) {
    console.error("Error al obtener citas:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Reprogramar cita
 * @route PUT /api/citas/:id/reprogramar
 * @access Private
 */
exports.reprogramarCita = async (req, res) => {
  try {
    const { fecha, horaInicio } = req.body;

    const cita = await Cita.findById(req.params.id);

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    // Calcular hora fin nueva
    const horaFin = calcularHoraFin(horaInicio, cita.duracionTotal);

    // Validar disponibilidad
    const disponible = await validarDisponibilidad(
      cita.especialistaId,
      fecha,
      horaInicio,
      horaFin
    );

    if (!disponible) {
      return res.status(400).json({ msg: "Horario no disponible" });
    }

    // Actualizar cita
    cita.fecha = fecha;
    cita.horaInicio = horaInicio;
    cita.horaFin = horaFin;
    cita.estado = "Programada";
    cita.actualizadoEn = new Date();

    await cita.save();

    res.json({ msg: "Cita reprogramada correctamente", cita });

  } catch (error) {
    console.error("Error al reprogramar cita:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Cancelar cita
 * @route PUT /api/citas/:id/cancelar
 * @access Private
 */
exports.cancelarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    cita.estado = "Cancelada";
    cita.actualizadoEn = new Date();

    await cita.save();

    res.json({ msg: "Cita cancelada correctamente", cita });

  } catch (error) {
    console.error("Error al cancelar cita:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Cambiar estado de cita a "Finalizada"
 * @route PUT /api/citas/:id/finalizar
 * @access Private
 */
exports.finalizarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    cita.estado = "Finalizada";
    cita.actualizadoEn = new Date();

    await cita.save();

    res.json({ msg: "Cita finalizada correctamente", cita });

  } catch (error) {
    console.error("Error al finalizar cita:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * @desc Obtener historial por cliente
 * @route GET /api/citas/historial/:clienteId
 * @access Private
 */
exports.historialPorCliente = async (req, res) => {
  try {
    const citas = await Cita.find({
      clienteId: req.params.clienteId,
      estado: "Finalizada"
    }).sort({ fecha: -1 });

    res.json(citas);

  } catch (error) {
    console.error("Error al obtener historial:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
