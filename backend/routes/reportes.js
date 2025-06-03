//📁 backend/routes/reportes.js

const express = require('express');
const router = express.Router();
const {
  crearReporte,
  obtenerReportes,
  resolverReporte
} = require('../controllers/reportesController');

const {
  verificarToken,
  verificarRol
} = require('../middleware/authMiddleware');

// Usuario crea reporte
router.post('/', verificarToken, crearReporte);

// Admin visualiza y resuelve
router.get('/', verificarToken, verificarRol('admin'), obtenerReportes);
router.patch('/:id/resolver', verificarToken, verificarRol('admin'), resolverReporte);

module.exports = router;