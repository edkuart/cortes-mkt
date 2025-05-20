// 📁 backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'clave_secreta';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || authHeader;

  if (!token) {
    return res.status(403).json({ mensaje: 'Token requerido.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Asegúrate que sea `req.user` para el controlador
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido.' });
  }
};

module.exports = { verificarToken };


