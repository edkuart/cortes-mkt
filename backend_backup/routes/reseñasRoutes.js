const express = require('express');
const router = express.Router();
const reseñasController = require('../controllers/reseñasController');

// POST: Crear nueva reseña
router.post('/', reseñasController.crearReseña);

// GET: Reseñas de un vendedor específico
router.get('/vendedor/:id', reseñasController.obtenerReseñasPorVendedor);

module.exports = router;
