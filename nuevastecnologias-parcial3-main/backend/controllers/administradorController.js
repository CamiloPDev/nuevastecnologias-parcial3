const Administrador = require('../models/Administrador');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST - Registrar nuevo administrador
exports.registrar = async (req, res) => {
    try {
        const { nombreCompleto, correo, telefono, password } = req.body;

        // Validaciones
        const errores = [];

        if (!nombreCompleto || nombreCompleto.trim() === '') {
            errores.push('El nombre completo es obligatorio');
        }

        if (!correo || correo.trim() === '') {
            errores.push('El correo es obligatorio');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            errores.push('El correo no tiene un formato válido');
        }

        if (!telefono || telefono.trim() === '') {
            errores.push('El teléfono es obligatorio');
        }

        if (!password || password.length < 6) {
            errores.push('La contraseña debe tener al menos 6 caracteres');
        }

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Errores de validación',
                errores: errores
            });
        }

        // Verificar que el correo no exista
        const administradorExistente = await Administrador.findOne({
            correo: correo.toLowerCase().trim()
        });

        if (administradorExistente) {
            return res.status(409).json({
                success: false,
                msg: 'Ya existe un administrador con ese correo'
            });
        }

        // Encriptar contraseña (RNF5)
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Crear administrador
        const administrador = await Administrador.create({
            nombreCompleto: nombreCompleto.trim(),
            correo: correo.toLowerCase().trim(),
            telefono: telefono.trim(),
            password: passwordEncriptada
        });

        // No devolver la contraseña en la respuesta
        const adminRespuesta = {
            _id: administrador._id,
            nombreCompleto: administrador.nombreCompleto,
            correo: administrador.correo,
            telefono: administrador.telefono,
            rol: administrador.rol,
            creadoEn: administrador.creadoEn
        };

        res.status(201).json({
            success: true,
            msg: 'Administrador registrado exitosamente',
            data: adminRespuesta
        });
    } catch (error) {
        console.error('Error en registrar:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            msg: 'Error al registrar administrador',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// POST - Login de administrador
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Validaciones
        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Correo y contraseña son obligatorios'
            });
        }

        // Buscar administrador por correo
        const administrador = await Administrador.findOne({
            correo: correo.toLowerCase().trim()
        });

        if (!administrador) {
            return res.status(401).json({
                success: false,
                msg: 'Credenciales inválidas'
            });
        }

        // Comparar contraseña encriptada
        const passwordValida = await bcrypt.compare(password, administrador.password);

        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                msg: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: administrador._id,
                correo: administrador.correo,
                rol: administrador.rol
            },
            process.env.JWT_SECRET || 'secret_key_default_cambiar_en_produccion',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            msg: 'Login exitoso',
            token: token,
            administrador: {
                _id: administrador._id,
                nombreCompleto: administrador.nombreCompleto,
                correo: administrador.correo,
                telefono: administrador.telefono,
                rol: administrador.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            msg: 'Error al iniciar sesión',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};

// GET - Obtener perfil del administrador autenticado
exports.perfil = async (req, res) => {
    try {
        // El ID viene del middleware de autenticación (req.usuario.id)
        const administrador = await Administrador.findById(req.usuario.id).select('-password');

        if (!administrador) {
            return res.status(404).json({
                success: false,
                msg: 'Administrador no encontrado'
            });
        }

        res.json({
            success: true,
            data: administrador
        });
    } catch (error) {
        console.error('Error en perfil:', error.message);

        res.status(500).json({
            success: false,
            msg: 'Error al obtener perfil',
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        });
    }
};
