// routes/devolucionesRoutes.js

const express = require('express');
const router = express.Router();
const {
  obtenerDevoluciones,
  aceptarDevolucion,
  rechazarDevolucion,
  crearDevolucion,
} = require('../controllers/devolucionesController');

const { verificarToken } = require('../middleware/authMiddleware'); // ✅ Importar el middleware

// 🟢 Rutas protegidas por JWT
router.get('/', verificarToken, obtenerDevoluciones);
router.post('/', verificarToken, crearDevolucion);
router.patch('/:id/aceptar', verificarToken, aceptarDevolucion);
router.patch('/:id/rechazar', verificarToken, rechazarDevolucion);

module.exports = router;


