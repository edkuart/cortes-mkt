// 📁 routes/entregasRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/entregasController');

router.post('/:pedidoId', controller.registrarEntrega);
router.patch('/:pedidoId', controller.actualizarEntrega);
router.get('/:pedidoId', controller.obtenerEntrega);
router.get('/detalle/:id', controller.obtenerDetalleEntrega);
router.patch('/:pedidoId/confirmar', controller.confirmarEntrega);

module.exports = router;




