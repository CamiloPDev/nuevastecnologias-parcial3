// src/controllers/servicioController.js
const Servicio = require("../models/Servicio");

/**
 * @desc Crear un nuevo servicio
 * @route POST /api/servicios
 * @access Private (admin)
 */
exports.crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, duracion } = req.body;

    if (!nombre || !categoria || !precio || !duracion) {
      return res.status(400).json({ msg: "Todos los campos obligatorios deben estar llenos" });
    }

    // Validar si ya existe
    const existe = await Servicio.findOne({ nombre });

    if (existe) {
      return res.status(400).json({ msg: "Ya existe un servicio con ese nombre" });
    }

    const nuevoServicio = await Servicio.create({
      nombre,
      descripcion,
      categoria,
      precio,
      duracion,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    });

    res.json({
      msg: "Servicio creado correctamente",
      servicio: nuevoServicio
    });

  } catch (error) {
    console.error("Error al crear servicio:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener todos los servicios
 * @route GET /api/servicios
 * @access Private
 */
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ creadoEn: -1 });
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener un servicio por ID
 * @route GET /api/servicios/:id
 * @access Private
 */
exports.obtenerServicioPorId = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    res.json(servicio);

  } catch (error) {
    console.error("Error al obtener servicio:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Actualizar un servicio
 * @route PUT /api/servicios/:id
 * @access Private (admin)
 */
exports.actualizarServicio = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, duracion, activo } = req.body;

    const servicio = await Servicio.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    servicio.nombre = nombre || servicio.nombre;
    servicio.descripcion = descripcion || servicio.descripcion;
    servicio.categoria = categoria || servicio.categoria;
    servicio.precio = precio || servicio.precio;
    servicio.duracion = duracion || servicio.duracion;
    if (activo !== undefined) servicio.activo = activo;

    servicio.actualizadoEn = new Date();

    await servicio.save();

    res.json({
      msg: "Servicio actualizado correctamente",
      servicio
    });

  } catch (error) {
    console.error("Error al actualizar servicio:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Eliminar servicio
 * @route DELETE /api/servicios/:id
 * @access Private (admin)
 */
exports.eliminarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    await servicio.deleteOne();

    res.json({ msg: "Servicio eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar servicio:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Activar o desactivar servicio
 * @route PATCH /api/servicios/:id/estado
 * @access Private
 */
exports.cambiarEstadoServicio = async (req, res) => {
  try {
    const { activo } = req.body;

    const servicio = await Servicio.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    servicio.activo = activo;
    servicio.actualizadoEn = new Date();

    await servicio.save();

    res.json({
      msg: `Servicio ${activo ? "activado" : "desactivado"} correctamente`,
      servicio
    });

  } catch (error) {
    console.error("Error al cambiar estado del servicio:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
