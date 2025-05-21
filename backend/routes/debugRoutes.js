//📁 routes/debugRoutes.js

const express = require('express');
const router = express.Router();
const { HistorialProducto } = require('../models');

// Agregar un cambio de prueba
router.get('/agregar-cambio', async (req, res) => {
  try {
    const nuevo = await HistorialProducto.create({
      productoId: 1,
      campo: 'precio',
      valorAnterior: 'Q150.00',
      valorNuevo: 'Q130.00'
    });

    res.json({ mensaje: '✅ Cambio agregado', cambio: nuevo });
  } catch (error) {
    console.error('❌ Error al agregar cambio:', error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
});

module.exports = router;