// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Leer token del header Authorization
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ msg: "Acceso denegado. No se envió token." });
    }

    // El header viene como: "Bearer tokenAquÍ"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token inválido o faltante." });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar la info del token en req.admin
    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Error de autenticación:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expirado. Inicia sesión nuevamente." });
    }

    return res.status(401).json({ msg: "Token inválido." });
  }
};
