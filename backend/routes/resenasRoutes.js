// 📁 backend/routes/resenasRoutes.js

/**
 * @swagger
 * tags:
 *   name: Reseñas
 *   description: Endpoints relacionados con las reseñas de productos

 * /api/resenas:
 *   post:
 *     summary: Crear nueva reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResenaInput'
 *     responses:
 *       201:
 *         description: Reseña creada correctamente

 * /api/resenas/comprador/{id}:
 *   get:
 *     summary: Obtener reseñas de un comprador específico
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comprador
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/vendedor/{id}:
 *   get:
 *     summary: Obtener reseñas de un vendedor específico
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vendedor
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/producto/{id}:
 *   get:
 *     summary: Obtener reseñas de un producto
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/{id}:
 *   patch:
 *     summary: Editar una reseña (dentro de 24h)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResenaInput'
 *     responses:
 *       200:
 *         description: Reseña actualizada

 *   delete:
 *     summary: Eliminar una reseña (si no tiene respuesta)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña eliminada

 * /api/resenas/{id}/responder:
 *   patch:
 *     summary: Responder una reseña (vendedor)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               respuestaVendedor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta guardada

 * /api/resenas/resumen/{id}:
 *   get:
 *     summary: Obtener resumen mensual de reseñas por vendedor
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del resumen mensual

 * components:
 *   schemas:
 *     ResenaInput:
 *       type: object
 *       required:
 *         - comentario
 *         - calificacion
 *         - compradorId
 *         - productoId
 *       properties:
 *         comentario:
 *           type: string
 *         calificacion:
 *           type: integer
 *         compradorId:
 *           type: integer
 *         productoId:
 *           type: integer
 */

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

