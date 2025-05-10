// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/', (req, res) => {
  res.json({ mensaje: "Ruta de autenticación activa" });
});

module.exports = router;

