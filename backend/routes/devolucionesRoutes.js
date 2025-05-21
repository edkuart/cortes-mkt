// routes/devolucionesRoutes.js

const express = require('express');
const router = express.Router();
const {
  obtenerDevoluciones,
  aceptarDevolucion,
  rechazarDevolucion,
  crearDevolucion,
} = require('../controllers/devolucionesController');

const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// 🟢 Rutas protegidas por JWT + Rol vendedor
router.get('/', verificarToken, verificarRol('vendedor'), obtenerDevoluciones);
router.patch('/:id/aceptar', verificarToken, verificarRol('vendedor'), aceptarDevolucion);
router.patch('/:id/rechazar', verificarToken, verificarRol('vendedor'), rechazarDevolucion);

// 🟡 Ruta para compradores (solo necesita estar autenticado)
router.post('/', verificarToken, crearDevolucion);

module.exports = router;



