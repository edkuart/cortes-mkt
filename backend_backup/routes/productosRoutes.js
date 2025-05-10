// 📦 backend/routes/productosRoutes.js

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// CRUD de productos

// GET: Obtener todos los productos
router.get('/', productosController.obtenerProductos);

// GET: Obtener un producto por ID
router.get('/:id', productosController.obtenerProductoPorId);

// POST: Crear un nuevo producto
router.post('/', productosController.crearProducto);

// PUT: Actualizar un producto existente
router.put('/:id', productosController.actualizarProducto);

// DELETE: Eliminar un producto
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;


