// 📁 backend/routes/notificacionesRoutes.js

const express = require('express');
const router = express.Router();
const { enviarCorreo } = require('../controllers/notificacionesController');

router.post('/correo', enviarCorreo);

module.exports = router;

