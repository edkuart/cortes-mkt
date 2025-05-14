// routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verificarToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// CRUD de productos

// GET: Obtener todos los productos
router.get('/', productosController.obtenerProductos);

// GET: Obtener un producto por ID
router.get('/:id', productosController.obtenerProductoPorId);

// POST: Crear producto con imagen
router.post('/', verificarToken, upload.single('imagen'), productosController.crearProducto);

// PUT: Actualizar un producto con nueva imagen (opcional)
router.put('/:id', verificarToken, upload.single('imagen'), productosController.actualizarProducto);

// DELETE: Eliminar un producto
router.delete('/:id', verificarToken, productosController.eliminarProducto);

// Crear un nuevo pedido
router.post('/crear', productosController.crearPedido);

router.get('/:id/promedio-calificacion', productosController.obtenerPromedioCalificacion);


module.exports = router;


