// 📁 backend/routes/resenasRoutes.js

const express = require('express');
const router = express.Router();
const {
  crearResena,
  obtenerResenasPorVendedor,
  obtenerResenasPorComprador,
  verificarSiYaReseno,
  obtenerPorProducto,
  obtenerUltimasPorProducto,
  editarResena,
  eliminarResena,
  guardarRespuestaVendedor,
  actualizarRespuestaVendedor,
  obtenerResumenMensualResenas
} = require('../controllers/resenasController');
const { verificarToken } = require('../middleware/authMiddleware');

// POST: Crear nueva reseña (protegido con token)
router.post('/', verificarToken, crearResena);

// GET: Reseñas de un comprador específico
router.get('/comprador/:id', obtenerResenasPorComprador);

// GET: Reseñas de un vendedor específico
router.get('/vendedor/:id', obtenerResenasPorVendedor);

// Verificar si ya se hizo reseña
router.get('/verificar/:compradorId/:pedidoId', verificarSiYaReseno);

// Reseñas por producto
router.get('/producto/:id', obtenerPorProducto);
router.get('/producto/:id/ultimas', obtenerUltimasPorProducto);

router.patch('/:id', verificarToken, editarResena);
router.delete('/:id', verificarToken, eliminarResena);

router.patch('/:id/responder', verificarToken, guardarRespuestaVendedor);
router.patch('/:id/respuesta', verificarToken, actualizarRespuestaVendedor);

router.get('/resumen/:id', obtenerResumenMensualResenas);

console.log("🧹 resenasRoutes cargado correctamente");

module.exports = router;

