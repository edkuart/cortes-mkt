// 📁 backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const secretKey = process.env.JWT_SECRET || 'clave_secreta';

// Verifica que el token sea válido y recupera el usuario de la base de datos
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || authHeader;

  console.log("🛡 Header Authorization recibido:", authHeader);
  console.log("🛡 Token extraído:", token);

  if (!token) {
    return res.status(403).json({ mensaje: 'Token requerido.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("✅ Token decodificado:", decoded);

    // Buscar usuario real desde DB para mantener actualizado
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado.' });
    }

    req.usuario = usuario; // Pasa usuario completo a los controladores
    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);
    res.status(401).json({ mensaje: 'Token inválido.' });
  }
};

// Middleware para verificar que el usuario tenga el rol adecuado
const verificarRol = (rolRequerido) => {
  return (req, res, next) => {
    const usuario = req.usuario;
    if (!usuario || usuario.rol !== rolRequerido) {
      return res.status(403).json({ mensaje: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
  };
};

// Alternativa para múltiples roles permitidos
const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const usuario = req.usuario;
    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
  authMiddleware,
};