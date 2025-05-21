// 📁 controllers/historialController.js

const { HistorialProducto } = require('../models');

exports.obtenerHistorialPorProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const historial = await HistorialProducto.findAll({
      where: { productoId: id },
      order: [['createdAt', 'DESC']]
    });
    res.json(historial);
  } catch (err) {
    console.error('❌ Error al obtener historial:', err);
    res.status(500).json({ mensaje: 'Error al obtener historial' });
  }
};