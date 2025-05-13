// 📁 backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'clave_secreta';

exports.verificarToken = (req, res, next) => {
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
    req.usuario = decoded;
    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);
    res.status(401).json({ mensaje: 'Token inválido.' });
  }
};


