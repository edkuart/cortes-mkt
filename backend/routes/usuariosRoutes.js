// backend/routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Registro de usuario
router.post('/registro', usuariosController.registrarUsuario);

// Login
router.post('/login', usuariosController.loginUsuario);

router.get('/', usuariosController.obtenerUsuarios);

module.exports = router;

