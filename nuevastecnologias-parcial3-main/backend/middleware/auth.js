const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Leer el token del header
    const token = req.header('x-auth-token');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    // 3. Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default_cambiar_en_produccion');
        req.usuario = cifrado; // Aquí se guarda el ID para usarlo en los controladores
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};