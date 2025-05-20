// 📁 backend/routes/mensajesRoutes.js

const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/mensajesController');
const { verificarToken } = require('../middleware/authMiddleware');

// ✅ Ruta pública (sin token)
router.get('/ping', mensajesController.pingMensajes);

// 🔒 Proteger rutas con autenticación
router.use(verificarToken);

// 📩 Obtener mensajes entre dos usuarios
router.get('/:otroUsuarioId', mensajesController.obtenerMensajes);

// ✉️ Enviar nuevo mensaje
router.post('/', mensajesController.enviarMensaje);

module.exports = router;


