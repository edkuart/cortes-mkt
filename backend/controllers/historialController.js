const { HistorialProducto } = require('../models');

const obtenerHistorial = async (req, res) => {
  try {
    const { id } = req.params;

    const historial = await HistorialProducto.findAll({
      where: { productoId: id },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'productoId',
        'campo',
        'valorAnterior',
        'valorNuevo',
        'imagenAnterior',
        'imagenNueva',
        'usuarioNombre',
        'createdAt'
      ]
    });

    const data = historial.map(h => ({
      ...h.toJSON(),
      usuario: h.usuarioNombre
    }));

    res.json(data);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ mensaje: 'Error al obtener historial' });
  }
};

module.exports = {
  obtenerHistorial
};