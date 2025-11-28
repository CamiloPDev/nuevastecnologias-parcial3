const Cliente = require('../models/Cliente');

// POST - Crear nuevo cliente (RF B3, B1)
exports.crearCliente = async (req, res) => {
    try {
        const { nombre, apellido, alias, cedula, telefono, correo } = req.body;

        // Validaciones
        const errores = [];

        if (!nombre || nombre.trim() === '') {
            errores.push('El nombre es obligatorio');
        }

        if (!apellido || apellido.trim() === '') {
            errores.push('El apellido es obligatorio');
        }

        if (!cedula || cedula.trim() === '') {
            errores.push('La cédula es obligatoria');
        }

        if (!telefono || telefono.trim() === '') {
            errores.push('El teléfono es obligatorio');
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        // Verificar que la cédula no esté repetida (RF B1)
        const clienteExistente = await Cliente.findOne({ cedula: cedula.trim() });

        if (clienteExistente) {
            return res.status(409).json({
                success: false,
                msg: 'Ya existe un cliente con esa cédula'
            });
        }

        // Crear cliente
        const cliente = await Cliente.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            alias: alias?.trim() || '',
            cedula: cedula.trim(),
            telefono: telefono.trim(),
            correo: correo?.trim() || ''
        });

        res.status(201).json({
            success: true,
            msg: 'Cliente creado exitosamente',
            data: cliente
        });
    } catch (error) {
        console.error('Error en crearCliente:', error.message);
        console.error('Stack:', error.stack);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                msg: 'Ya existe un cliente con esa cédula'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al crear cliente',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Listar todos los clientes con paginación opcional (RF B3)
exports.listarClientes = async (req, res) => {
    try {
        const { pagina = 1, limite = 50 } = req.query;

        const paginaInt = parseInt(pagina);
        const limiteInt = parseInt(limite);
        const skip = (paginaInt - 1) * limiteInt;

        const clientes = await Cliente.find()
            .sort({ fechaRegistro: -1 })
            .limit(limiteInt)
            .skip(skip);

        const total = await Cliente.countDocuments();

        res.json({
            success: true,
            count: clientes.length,
            total: total,
            paginaActual: paginaInt,
            totalPaginas: Math.ceil(total / limiteInt),
            data: clientes
        });
    } catch (error) {
        console.error('Error en listarClientes:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al listar clientes',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Obtener cliente por ID (RF B3)
exports.obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el cliente con ID ${id}`
            });
        }

        res.json({
            success: true,
            data: cliente
        });
    } catch (error) {
        console.error('Error en obtenerClientePorId:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cliente inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al obtener cliente',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Buscar clientes por nombre, cédula o alias (RF B4)
exports.buscarClientes = async (req, res) => {
    try {
        const { termino } = req.query;

        if (!termino || termino.trim() === '') {
            return res.status(400).json({
                success: false,
                msg: 'Debe proporcionar un término de búsqueda'
            });
        }

        // Búsqueda flexible con regex (case-insensitive)
        const regex = new RegExp(termino.trim(), 'i');

        const clientes = await Cliente.find({
            $or: [
                { nombre: regex },
                { apellido: regex },
                { alias: regex },
                { cedula: regex }
            ]
        }).sort({ fechaRegistro: -1 });

        res.json({
            success: true,
            count: clientes.length,
            termino: termino.trim(),
            data: clientes
        });
    } catch (error) {
        console.error('Error en buscarClientes:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al buscar clientes',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// PUT - Actualizar cliente (RF B3)
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, alias, cedula, telefono, correo } = req.body;

        // Verificar que el cliente existe
        const clienteExistente = await Cliente.findById(id);

        if (!clienteExistente) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el cliente con ID ${id}`
            });
        }

        // Si se está actualizando la cédula, verificar que no esté en uso
        if (cedula && cedula !== clienteExistente.cedula) {
            const cedulaEnUso = await Cliente.findOne({ cedula: cedula.trim() });
            if (cedulaEnUso) {
                return res.status(409).json({
                    success: false,
                    msg: 'Ya existe otro cliente con esa cédula'
                });
            }
        }

        // Preparar datos a actualizar
        const datosActualizar = {};

        if (nombre !== undefined) datosActualizar.nombre = nombre.trim();
        if (apellido !== undefined) datosActualizar.apellido = apellido.trim();
        if (alias !== undefined) datosActualizar.alias = alias.trim();
        if (cedula !== undefined) datosActualizar.cedula = cedula.trim();
        if (telefono !== undefined) datosActualizar.telefono = telefono.trim();
        if (correo !== undefined) datosActualizar.correo = correo.trim();

        datosActualizar.actualizadoEn = Date.now();

        // Actualizar cliente
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            datosActualizar,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            msg: 'Cliente actualizado exitosamente',
            data: clienteActualizado
        });
    } catch (error) {
        console.error('Error en actualizarCliente:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cliente inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al actualizar cliente',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// DELETE - Eliminar cliente (RF B3)
exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findByIdAndDelete(id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el cliente con ID ${id}`
            });
        }

        res.json({
            success: true,
            msg: 'Cliente eliminado exitosamente',
            data: {
                _id: cliente._id,
                nombre: cliente.nombre,
                apellido: cliente.apellido
            }
        });
    } catch (error) {
        console.error('Error en eliminarCliente:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cliente inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al eliminar cliente',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};
