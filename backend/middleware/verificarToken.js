// 📁 backend/middleware/verificarToken.js

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'clave_secreta';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded; // ⬅ importante: lo usamos en `actualizarPerfil`
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;