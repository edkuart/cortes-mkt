// 📁 routes/favoritosRoutes.js

const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');

router.get('/:usuarioId', favoritosController.obtenerFavoritos);
router.post('/', favoritosController.agregarFavorito);
router.delete('/:usuarioId/:productoId', favoritosController.eliminarFavorito);
router.get('/producto/:productoId', favoritosController.contarFavoritosPorProducto);
router.get('/sugerencias/:productoId', favoritosController.obtenerSugerenciasPorProducto);

module.exports = router;