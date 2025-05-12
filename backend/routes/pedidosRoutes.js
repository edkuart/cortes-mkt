// routes/pedidosRoutes.js

const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verificarToken } = require('../middleware/authMiddleware');

// Crear pedido
router.post('/', pedidosController.crearPedido);

router.get('/:id', pedidosController.obtenerPedidoPorId);

// Obtener pedidos por comprador
router.get('/usuario/:id', pedidosController.obtenerPedidosPorUsuario);

// Cambiar estado del pedido
router.put('/:id/estado', pedidosController.cambiarEstadoPedido);

// Obtener todos los pedidos
router.get('/', pedidosController.obtenerTodosLosPedidos);

// Obtener pedidos del vendedor autenticado (protegido)
router.get('/vendedor', verificarToken, pedidosController.obtenerPedidosPorVendedor);

module.exports = router;
