// 📁 routes/historialRoutes.js

const express = require('express');
const router = express.Router();
const { obtenerHistorialPorProducto } = require('../controllers/historialController');

router.get('/:id', obtenerHistorialPorProducto);

module.exports = router;