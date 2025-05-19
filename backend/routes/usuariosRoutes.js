// 📁 backend/routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const {
  actualizarPerfil,
  obtenerUsuarios,
  loginDebug
} = require('../controllers/usuariosController');
const verificarToken = require('../middleware/verificarToken');
const multer = require('multer');

// Configuración de multer para subir imágenes de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/perfiles/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// ✅ ESTA es la ruta que te faltaba
router.get('/', obtenerUsuarios);

// Ruta protegida para actualizar perfil
router.patch('/:id', verificarToken, upload.fields([{ name: 'fotoPerfil', maxCount: 1 }]), actualizarPerfil);

// Ruta de prueba
router.post('/debug/token', loginDebug);

module.exports = router;