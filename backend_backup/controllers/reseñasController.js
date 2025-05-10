const Reseña = require('../models/reseña.model');
const Usuario = require('../models/usuario.model');

// Crear una nueva reseña
const crearReseña = async (req, res) => {
  try {
    const { vendedorId, compradorId, comentario, calificacion } = req.body;

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificación debe ser entre 1 y 5' });
    }

    const reseña = await Reseña.create({
      vendedorId,
      compradorId,
      comentario,
      calificacion
    });

    res.status(201).json({ mensaje: 'Reseña creada', reseña });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ mensaje: 'Error al crear reseña' });
  }
};

// Obtener reseñas de un vendedor
const obtenerReseñasPorVendedor = async (req, res) => {
  try {
    const { id } = req.params;

    const reseñas = await Reseña.findAll({
      where: { vendedorId: id },
      include: [{ model: Usuario, as: 'Comprador', attributes: ['id', 'nombreCompleto'] }]
    });

    res.json(reseñas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
};

module.exports = {
  crearReseña,
  obtenerReseñasPorVendedor
};
