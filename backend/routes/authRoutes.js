// 📁 routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/dpi/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const name = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post(
  '/registro',
  upload.fields([
    { name: 'fotoDPIFrente', maxCount: 1 },
    { name: 'fotoDPIReverso', maxCount: 1 },
    { name: 'selfieConDPI', maxCount: 1 },
    { name: 'licenciaConducir', maxCount: 1 },
  ]),
  authController.registrar
);

router.post('/login', authController.login);
router.post('/google-login', authController.loginConGoogle);

module.exports = router;
