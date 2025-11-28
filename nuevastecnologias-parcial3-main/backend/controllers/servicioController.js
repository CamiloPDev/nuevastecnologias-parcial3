const Servicio = require('../models/Servicio');

// GET - Obtener todos los servicios activos
exports.getServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find({ activo: true })
            .sort({ categoria: 1, nombre: 1 });

        res.json({
            success: true,
            count: servicios.length,
            data: servicios
        });
    } catch (error) {
        console.error('Error en getServicios:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            msg: 'Error al obtener los servicios',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Buscar servicios con filtros
exports.buscarServicios = async (req, res) => {
    try {
        const { nombre, categoria, precioMin, precioMax } = req.query;

        const filtros = { activo: true };

        // Búsqueda por nombre (case-insensitive)
        if (nombre && nombre.trim() !== '') {
            filtros.nombre = { $regex: nombre.trim(), $options: 'i' };
        }

        // Búsqueda por categoría (case-insensitive)
        if (categoria && categoria.trim() !== '') {
            filtros.categoria = { $regex: categoria.trim(), $options: 'i' };
        }

        // Filtro por rango de precio
        if (precioMin || precioMax) {
            filtros.precio = {};

            if (precioMin && !isNaN(precioMin)) {
                filtros.precio.$gte = parseFloat(precioMin);
            }

            if (precioMax && !isNaN(precioMax)) {
                filtros.precio.$lte = parseFloat(precioMax);
            }
        }

        const servicios = await Servicio.find(filtros)
            .sort({ categoria: 1, precio: 1 });

        res.json({
            success: true,
            count: servicios.length,
            filtros_aplicados: {
                nombre: nombre || 'ninguno',
                categoria: categoria || 'todas',
                precioMin: precioMin || 'sin límite',
                precioMax: precioMax || 'sin límite'
            },
            data: servicios
        });
    } catch (error) {
        console.error('Error en buscarServicios:', error.message);
        console.error('Parámetros recibidos:', req.query);

        res.status(500).json({
            success: false,
            msg: 'Error al buscar servicios',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Obtener servicio por ID
exports.obtenerServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const servicio = await Servicio.findById(id);

        if (!servicio || !servicio.activo) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el servicio con ID ${id}`
            });
        }

        res.json({
            success: true,
            data: servicio
        });
    } catch (error) {
        console.error(`Error en obtenerServicioPorId (ID: ${req.params.id}):`, error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de servicio inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al obtener el servicio',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// POST - Crear nuevo servicio
exports.crearServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio, duracion, categoria } = req.body;

        const errores = [];

        if (!nombre || nombre.trim() === '') {
            errores.push('El nombre es obligatorio');
        }

        if (!precio || isNaN(precio) || precio <= 0) {
            errores.push('El precio debe ser un número mayor a 0');
        }

        if (!duracion || isNaN(duracion) || duracion <= 0) {
            errores.push('La duración debe ser un número mayor a 0 minutos');
        }

        if (!categoria || categoria.trim() === '') {
            errores.push('La categoría es obligatoria');
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        const servicio = await Servicio.create({
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || '',
            precio: parseFloat(precio),
            duracion: parseInt(duracion),
            categoria: categoria.trim(),
            activo: true
        });

        res.status(201).json({
            success: true,
            msg: 'Servicio creado correctamente',
            data: servicio
        });
    } catch (error) {
        console.error('Error en crearServicio:', error.message);
        console.error('Datos recibidos:', req.body);
        console.error('Stack:', error.stack);

        // Manejo específico para errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                msg: 'Error de validación',
                errores: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                msg: 'Ya existe un servicio con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al crear el servicio',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// PUT - Actualizar servicio
exports.actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion, categoria } = req.body;

        // Verificar que el servicio existe
        const servicioExistente = await Servicio.findById(id);

        if (!servicioExistente || !servicioExistente.activo) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el servicio con ID ${id}`
            });
        }

        // Validaciones
        const errores = [];
        const datosActualizar = {};

        if (nombre !== undefined) {
            if (nombre.trim() === '') {
                errores.push('El nombre no puede estar vacío');
            } else {
                datosActualizar.nombre = nombre.trim();
            }
        }

        if (precio !== undefined) {
            if (isNaN(precio) || precio <= 0) {
                errores.push('El precio debe ser un número mayor a 0');
            } else {
                datosActualizar.precio = parseFloat(precio);
            }
        }

        if (duracion !== undefined) {
            if (isNaN(duracion) || duracion <= 0) {
                errores.push('La duración debe ser un número mayor a 0');
            } else {
                datosActualizar.duracion = parseInt(duracion);
            }
        }

        if (categoria !== undefined) {
            if (categoria.trim() === '') {
                errores.push('La categoría no puede estar vacía');
            } else {
                datosActualizar.categoria = categoria.trim();
            }
        }

        if (descripcion !== undefined) {
            datosActualizar.descripcion = descripcion.trim() || '';
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        // Verificar que se envió al menos un campo para actualizar
        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'Debe enviar al menos un campo para actualizar'
            });
        }

        // Actualizar fecha de modificación
        datosActualizar.actualizadoEn = Date.now();

        // Actualizar servicio
        const servicioActualizado = await Servicio.findByIdAndUpdate(
            id,
            datosActualizar,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            msg: 'Servicio actualizado correctamente',
            data: servicioActualizado
        });
    } catch (error) {
        console.error(`Error en actualizarServicio (ID: ${req.params.id}):`, error.message);
        console.error('Datos recibidos:', req.body);
        console.error('Stack:', error.stack);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de servicio inválido'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                msg: 'Error de validación',
                errores: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el servicio',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// DELETE - Eliminar servicio (soft delete)
exports.eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que existe
        const servicio = await Servicio.findById(id);

        if (!servicio || !servicio.activo) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el servicio con ID ${id}`
            });
        }

        // Soft delete - marcar como inactivo
        await Servicio.findByIdAndUpdate(id, {
            activo: false,
            actualizadoEn: Date.now()
        });

        res.json({
            success: true,
            msg: 'Servicio eliminado correctamente',
            data: {
                id: servicio._id,
                nombre: servicio.nombre
            }
        });
    } catch (error) {
        console.error(`Error en eliminarServicio (ID: ${req.params.id}):`, error.message);
        console.error('Stack:', error.stack);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de servicio inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al eliminar el servicio',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};