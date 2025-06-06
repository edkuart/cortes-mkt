// 📁 backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');

// --- LOGS DE DEBUG (PUEDES QUITARLOS DESPUÉS) ---
console.log('[AuthRoutes] Cargando authController...');
if (authController && typeof authController.registrar === 'function') {
  console.log('[AuthRoutes] authController.registrar cargado correctamente como función.');
} else {
  console.error('[AuthRoutes] ERROR: authController.registrar NO es una función o authController no está definido. Valor:', authController?.registrar);
}
// --- FIN LOGS DE DEBUG ---

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/dpi/'), // Asegúrate que esta carpeta exista
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Usar path.extname para obtener la extensión de forma segura
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

// Añadir validación de tipo de archivo si es necesario
const upload = multer({ 
  storage: storage,
  // fileFilter: (req, file, cb) => { /* ... tu lógica de filtro ... */ } 
});

router.post(
  '/registro',
  upload.fields([
    { name: 'fotoDPIFrente', maxCount: 1 },
    { name: 'fotoDPIReverso', maxCount: 1 },
    { name: 'selfieConDPI', maxCount: 1 },
    { name: 'licenciaConducir', maxCount: 1 }, // Opcional si no todos los vendedores son conductores
  ]),
  authController.registrar // Este debe ser una función
);

router.post('/login', authController.login);
router.post('/google-login', authController.loginConGoogle);

module.exports = router;