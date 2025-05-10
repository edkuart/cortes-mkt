const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Crear pedido
router.post('/', pedidosController.crearPedido);

// Obtener pedidos por comprador
router.get('/usuario/:id', pedidosController.obtenerPedidosPorUsuario);

// Cambiar estado del pedido
router.put('/:id/estado', pedidosController.cambiarEstadoPedido);

router.get('/todos', pedidosController.obtenerTodosLosPedidos);

module.exports = router;
