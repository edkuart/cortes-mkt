// 📁 backend/routes/resenasRoutes.js

const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenasController');
const { verificarToken } = require('../middleware/authMiddleware');

// POST: Crear nueva reseña (protegido con token)
router.post('/', verificarToken, resenasController.crearResena);

// GET: Reseñas de un comprador específico
router.get('/comprador/:id', resenasController.obtenerResenasPorComprador);

// GET: Reseñas de un vendedor específico
router.get('/vendedor/:id', resenasController.obtenerResenasPorVendedor);

console.log("🧹 resenasRoutes cargado correctamente");

module.exports = router;



