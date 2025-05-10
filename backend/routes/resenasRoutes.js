// routes/resenasRoutes.js
const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenasController');

// POST: Crear nueva reseña
router.post('/', resenasController.crearReseña);

// GET: Reseñas de un vendedor específico
router.get('/vendedor/:id', resenasController.obtenerReseñasPorVendedor);

console.log("🧹 resenasRoutes cargado correctamente");

module.exports = router;


