// 📁 routes/historialRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerHistorial } = require('../controllers/historialController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/:id', verificarToken, obtenerHistorial);

router.get('/:id', obtenerHistorial); // ✅ Usa el nombre correcto

module.exports = router;
