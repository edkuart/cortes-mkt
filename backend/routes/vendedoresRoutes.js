// routes/vendedoresRoutes.js

const express = require('express');
const router = express.Router();
const { crearVendedor } = require('../controllers/vendedoresController');
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

router.get('/:id/ranking', verificarToken, vendedoresController.obtenerRankingVendedor);

router.post('/crear', verificarToken, crearVendedor);
  
module.exports = router;

