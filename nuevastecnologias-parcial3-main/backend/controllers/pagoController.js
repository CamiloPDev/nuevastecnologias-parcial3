const Pago = require('../models/Pago');
const Cita = require('../models/Cita');

// POST - Registrar nuevo pago (RF D3)
exports.registrarPago = async (req, res) => {
    try {
        const { citaId, monto, metodoPago, notas } = req.body;

        // Validaciones
        const errores = [];

        if (!citaId) errores.push('La cita es obligatoria');
        if (!monto || isNaN(monto) || monto <= 0) {
            errores.push('El monto debe ser un número mayor a 0');
        }
        if (!metodoPago) errores.push('El método de pago es obligatorio');

        const metodosValidos = ['efectivo', 'transferencia', 'nequi', 'tarjeta', 'otro'];
        if (metodoPago && !metodosValidos.includes(metodoPago)) {
            errores.push(`El método de pago debe ser uno de: ${metodosValidos.join(', ')}`);
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        // Verificar que la cita existe
        const cita = await Cita.findById(citaId);

        if (!cita) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontró la cita especificada'
            });
        }

        // Crear el pago
        const pago = await Pago.create({
            cita: citaId,
            monto: parseFloat(monto),
            metodoPago: metodoPago,
            notas: notas || ''
        });

        // Si el pago cubre el total, actualizar estado de la cita a 'completada'
        if (parseFloat(monto) >= cita.precioTotal) {
            await Cita.findByIdAndUpdate(citaId, {
                estado: 'completada',
                actualizadoEn: Date.now()
            });
        }

        // Poblar datos para la respuesta
        const pagoCompleto = await Pago.findById(pago._id)
            .populate({
                path: 'cita',
                populate: [
                    { path: 'cliente', select: 'nombre apellido' },
                    { path: 'administrador', select: 'nombreCompleto' }
                ]
            });

        res.status(201).json({
            success: true,
            msg: 'Pago registrado exitosamente',
            data: pagoCompleto
        });
    } catch (error) {
        console.error('Error en registrarPago:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            msg: 'Error al registrar pago',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Listar todos los pagos
exports.listarPagos = async (req, res) => {
    try {
        const pagos = await Pago.find()
            .populate({
                path: 'cita',
                populate: [
                    { path: 'cliente', select: 'nombre apellido' },
                    { path: 'administrador', select: 'nombreCompleto' }
                ]
            })
            .sort({ fecha: -1 });

        res.json({
            success: true,
            count: pagos.length,
            data: pagos
        });
    } catch (error) {
        console.error('Error en listarPagos:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al listar pagos',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Obtener pago por ID
exports.obtenerPagoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pago = await Pago.findById(id)
            .populate({
                path: 'cita',
                populate: [
                    { path: 'cliente', select: 'nombre apellido cedula telefono' },
                    { path: 'administrador', select: 'nombreCompleto' }
                ]
            });

        if (!pago) {
            return res.status(404).json({
                success: false,
                msg: `No se encontró el pago con ID ${id}`
            });
        }

        res.json({
            success: true,
            data: pago
        });
    } catch (error) {
        console.error('Error en obtenerPagoPorId:', error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: 'ID de pago inválido'
            });
        }

        res.status(500).json({
            success: false,
            msg: 'Error al obtener pago',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Reportes: Total recaudado (RF D4)
exports.reporteRecaudacion = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        let filtro = { estado: 'completado' };

        // Si no se proporciona rango, usar el día actual
        if (!fechaInicio && !fechaFin) {
            const hoy = new Date();
            const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
            const finDia = new Date(hoy.setHours(23, 59, 59, 999));

            filtro.fecha = { $gte: inicioDia, $lte: finDia };
        } else {
            // Usar rango proporcionado
            if (fechaInicio && fechaFin) {
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                fin.setHours(23, 59, 59, 999);

                filtro.fecha = { $gte: inicio, $lte: fin };
            } else if (fechaInicio) {
                const inicio = new Date(fechaInicio);
                filtro.fecha = { $gte: inicio };
            } else if (fechaFin) {
                const fin = new Date(fechaFin);
                fin.setHours(23, 59, 59, 999);
                filtro.fecha = { $lte: fin };
            }
        }

        // Obtener todos los pagos del período
        const pagos = await Pago.find(filtro);

        // Calcular total recaudado
        const totalRecaudado = pagos.reduce((suma, pago) => suma + pago.monto, 0);

        // Agrupar por método de pago
        const porMetodo = pagos.reduce((acc, pago) => {
            if (!acc[pago.metodoPago]) {
                acc[pago.metodoPago] = { cantidad: 0, total: 0 };
            }
            acc[pago.metodoPago].cantidad++;
            acc[pago.metodoPago].total += pago.monto;
            return acc;
        }, {});

        res.json({
            success: true,
            periodo: {
                fechaInicio: fechaInicio || 'hoy',
                fechaFin: fechaFin || 'hoy'
            },
            resumen: {
                totalPagos: pagos.length,
                totalRecaudado: Math.round(totalRecaudado * 100) / 100,
                porMetodoPago: porMetodo
            }
        });
    } catch (error) {
        console.error('Error en reporteRecaudacion:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al generar reporte de recaudación',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};
