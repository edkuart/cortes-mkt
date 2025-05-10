// routes/vendedoresRoutes.js

const express = require('express');
const router = express.Router();
const vendedoresController = require('../controllers/vendedoresController');
const { verificarToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:id', verificarToken, vendedoresController.obtenerPerfil);
router.patch('/:id/aprobar', verificarToken, vendedoresController.aprobarVendedor); // protegida para admin

router.post(
    '/solicitud',
    verificarToken,
    upload.fields([
      { name: 'fotoDPIFrente', maxCount: 1 },
      { name: 'fotoDPIReverso', maxCount: 1 },
      { name: 'selfieConDPI', maxCount: 1 },
      { name: 'licenciaConducir', maxCount: 1 },
    ]),
    vendedoresController.solicitarVendedor
  );

module.exports = router;

