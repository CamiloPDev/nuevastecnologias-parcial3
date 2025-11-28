// src/controllers/clienteController.js
const Cliente = require("../models/Cliente");

/**
 * @desc Crear un nuevo cliente
 * @route POST /api/clientes
 * @access Private (admin)
 */
exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, alias, cedula, telefono, correo } = req.body;

    // Validación básica
    if (!nombre || !apellido || !cedula || !telefono) {
      return res.status(400).json({ msg: "Los campos obligatorios no pueden estar vacíos" });
    }

    // Verificar si ya existe por cédula o correo
    const existe = await Cliente.findOne({
      $or: [{ cedula }, { correo }]
    });

    if (existe) {
      return res.status(400).json({ msg: "El cliente ya está registrado" });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      alias,
      cedula,
      telefono,
      correo,
      fechaRegistro: new Date(),
    });

    res.json({
      msg: "Cliente creado correctamente",
      cliente: nuevoCliente
    });

  } catch (error) {
    console.error("Error al crear cliente:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener todos los clientes
 * @route GET /api/clientes
 * @access Private
 */
exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ fechaRegistro: -1 });
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Buscar clientes por nombre, apellido, alias o cédula
 * @route GET /api/clientes/buscar?query=text
 * @access Private
 */
exports.buscarClientes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ msg: "Debe proporcionar un texto de búsqueda" });
    }

    const clientes = await Cliente.find({
      $or: [
        { nombre: { $regex: query, $options: "i" } },
        { apellido: { $regex: query, $options: "i" } },
        { alias: { $regex: query, $options: "i" } },
        { cedula: { $regex: query, $options: "i" } }
      ]
    });

    res.json(clientes);

  } catch (error) {
    console.error("Error en búsqueda de clientes:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Obtener un cliente por ID
 * @route GET /api/clientes/:id
 * @access Private
 */
exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    res.json(cliente);

  } catch (error) {
    console.error("Error al obtener cliente por ID:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Actualizar cliente
 * @route PUT /api/clientes/:id
 * @access Private
 */
exports.actualizarCliente = async (req, res) => {
  try {
    const { nombre, apellido, alias, cedula, telefono, correo } = req.body;

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    cliente.nombre = nombre || cliente.nombre;
    cliente.apellido = apellido || cliente.apellido;
    cliente.alias = alias || cliente.alias;
    cliente.cedula = cedula || cliente.cedula;
    cliente.telefono = telefono || cliente.telefono;
    cliente.correo = correo || cliente.correo;
    cliente.actualizadoEn = new Date();

    await cliente.save();

    res.json({
      msg: "Cliente actualizado correctamente",
      cliente
    });

  } catch (error) {
    console.error("Error al actualizar cliente:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


/**
 * @desc Eliminar cliente (opcional)
 * @route DELETE /api/clientes/:id
 * @access Private
 */
exports.eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    await cliente.deleteOne();

    res.json({ msg: "Cliente eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar cliente:", error.message);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
