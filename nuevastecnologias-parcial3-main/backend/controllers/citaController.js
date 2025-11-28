const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

// POST - Crear nueva cita (RF A2, A3, A8 con validación de disponibilidad)
exports.crearCita = async (req, res) => {
    try {
        const { clienteId, administradorId, fecha, hora, serviciosIds, notas } = req.body;

        // Validaciones básicas
        const errores = [];

        if (!clienteId) errores.push('El cliente es obligatorio');
        if (!administradorId) errores.push('El administrador es obligatorio');
        if (!fecha) errores.push('La fecha es obligatoria');
        if (!hora) errores.push('La hora es obligatoria');
        if (!serviciosIds || serviciosIds.length === 0) {
            errores.push('Debe seleccionar al menos un servicio');
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        // Buscar los servicios en la BD (RF A8)
        const serviciosCompletos = await Servicio.find({
            _id: { $in: serviciosIds },
            activo: true
        });

        if (serviciosCompletos.length !== serviciosIds.length) {
            return res.status(400).json({
                success: false,
                msg: 'Uno o más servicios no existen o están inactivos'
            });
        }

        // Cálculo automático de precios y duraciones (RF A8)
        let precioTotal = 0;
        let duracionTotal = 0;

        const serviciosParaCita = serviciosCompletos.map(servicio => {
            precioTotal += servicio.precio;
            duracionTotal += servicio.duracion;

            return {
                servicio: servicio._id,
                nombre: servicio.nombre,
                precio: servicio.precio,
                duracion: servicio.duracion
            };
        });

        // VALIDACIÓN DE DISPONIBILIDAD (RF A5, A6)
        // Convertir hora a minutos para facilitar comparaciones
        const [horaInicio, minutoInicio] = hora.split(':').map(Number);
        const minutosInicio = horaInicio * 60 + minutoInicio;
        const minutosFin = minutosInicio + duracionTotal;

        // Normalizar fecha (inicio y fin del día)
        const fechaCita = new Date(fecha);
        const inicioDia = new Date(fechaCita.setHours(0, 0, 0, 0));
        const finDia = new Date(fechaCita.setHours(23, 59, 59, 999));

        // Buscar citas del mismo administrador en la misma fecha
        const citasDelDia = await Cita.find({
            administrador: administradorId,
            fecha: { $gte: inicioDia, $lte: finDia },
            estado: { $ne: 'cancelada' }
        });

        // Verificar si hay conflicto de horarios
        for (const citaExistente of citasDelDia) {
            const [horaCita, minutoCita] = citaExistente.hora.split(':').map(Number);
            const minutosCitaInicio = horaCita * 60 + minutoCita;
            const minutosCitaFin = minutosCitaInicio + citaExistente.duracionTotal;

            // Detectar solapamiento
            const haySolapamiento = (
                (minutosInicio >= minutosCitaInicio && minutosInicio < minutosCitaFin) ||
                (minutosFin > minutosCitaInicio && minutosFin <= minutosCitaFin) ||
                (minutosInicio <= minutosCitaInicio && minutosFin >= minutosCitaFin)
            );

            if (haySolapamiento) {
                return res.status(409).json({
                    success: false,
                    msg: 'El administrador ya tiene una cita en ese horario',
                    conflicto: {
                        horaExistente: citaExistente.hora,
                        duracionExistente: citaExistente.duracionTotal
                    }
                });
            }
        }

        // Crear la cita
        const nuevaCita = await Cita.create({
            cliente: clienteId,
            administrador: administradorId,
            fecha: new Date(fecha),
            hora: hora,
            servicios: serviciosParaCita,
            duracionTotal: duracionTotal,
            precioTotal: precioTotal,
            notas: notas || ''
        });

        // Poblar datos para la respuesta
        const citaCompleta = await Cita.findById(nuevaCita._id)
            .populate('cliente', 'nombre apellido telefono cedula')
            .populate('administrador', 'nombreCompleto telefono');

        res.status(201).json({
            success: true,
            msg: 'Cita creada exitosamente',
            data: citaCompleta
        });
    } catch (error) {
        console.error('Error en crearCita:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            msg: 'Error al crear cita',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Listar todas las citas
exports.listarCitas = async (req, res) => {
    try {
        const citas = await Cita.find()
            .populate('cliente', 'nombre apellido telefono')
            .populate('administrador', 'nombreCompleto')
            .sort({ fecha: -1, hora: -1 });

        res.json({
            success: true,
            count: citas.length,
            data: citas
        });
    } catch (error) {
        console.error('Error en listarCitas:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al listar citas',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Listar citas por fecha (RF D1 - Agenda Diaria)
exports.listarCitasPorFecha = async (req, res) => {
    try {
        const { fecha } = req.params;

        const fechaBusqueda = new Date(fecha);
        const inicioDia = new Date(fechaBusqueda.setHours(0, 0, 0, 0));
        const finDia = new Date(fechaBusqueda.setHours(23, 59, 59, 999));

        const citas = await Cita.find({
            fecha: { $gte: inicioDia, $lte: finDia }
        })
            .populate('cliente', 'nombre apellido telefono')
            .populate('administrador', 'nombreCompleto')
            .sort({ hora: 1 });

        res.json({
            success: true,
            fecha: fecha,
            count: citas.length,
            data: citas
        });
    } catch (error) {
        console.error('Error en listarCitasPorFecha:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al listar citas por fecha',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Listar citas por cliente (Historial)
exports.listarCitasPorCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;

        const citas = await Cita.find({ cliente: clienteId })
            .populate('administrador', 'nombreCompleto')
            .sort({ fecha: -1 });

        res.json({
            success: true,
            clienteId: clienteId,
            count: citas.length,
            data: citas
        });
    } catch (error) {
        console.error('Error en listarCitasPorCliente:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cliente inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al listar citas del cliente',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Obtener cita por ID
exports.obtenerCitaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findById(id)
            .populate('cliente', 'nombre apellido telefono cedula')
            .populate('administrador', 'nombreCompleto telefono');

        if (!cita) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró la cita con ID ${id}`
            });
        }

        res.json({
            success: true,
            data: cita
        });
    } catch (error) {
        console.error('Error en obtenerCitaPorId:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cita inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al obtener cita',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// PUT - Actualizar estado de cita
exports.actualizarEstadoCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'en_curso', 'completada', 'cancelada'];

        if (!estado || !estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                msg: `El estado debe ser uno de: ${estadosValidos.join(', ')}`
            });
        }

        const citaActualizada = await Cita.findByIdAndUpdate(
            id,
            { estado: estado, actualizadoEn: Date.now() },
            { new: true, runValidators: true }
        )
            .populate('cliente', 'nombre apellido')
            .populate('administrador', 'nombreCompleto');

        if (!citaActualizada) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró la cita con ID ${id}`
            });
        }

        res.json({
            success: true,
            msg: 'Estado de cita actualizado exitosamente',
            data: citaActualizada
        });
    } catch (error) {
        console.error('Error en actualizarEstadoCita:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cita inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al actualizar estado de cita',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// DELETE - Cancelar cita
exports.cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;

        const citaCancelada = await Cita.findByIdAndUpdate(
            id,
            { estado: 'cancelada', actualizadoEn: Date.now() },
            { new: true }
        );

        if (!citaCancelada) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró la cita con ID ${id}`
            });
        }

        res.json({
            success: true,
            msg: 'Cita cancelada exitosamente',
            data: citaCancelada
        });
    } catch (error) {
        console.error('Error en cancelarCita:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de cita inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al cancelar cita',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};
