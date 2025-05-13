// 📁 backend/controllers/resenasController.js

const { Resena, Usuario } = require('../models');

// Obtener reseñas de un comprador específico
const obtenerResenasPorComprador = async (req, res) => {
  try {
    const { id } = req.params;

    const resenas = await Resena.findAll({
      where: { compradorId: id },
      include: [{ model: Usuario, as: 'Vendedor', attributes: ['id', 'nombreCompleto'] }]
    });

    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas del comprador:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
};

// Crear una nueva resena
const crearResena = async (req, res) => {
  try {
    const { vendedorId, comentario, calificacion, pedidoId } = req.body;
    const compradorId = req.usuario.id;

    if (!pedidoId) {
      return res.status(400).json({ mensaje: 'Se requiere el ID del pedido.' });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificacion debe estar entre 1 y 5.' });
    }

    // Validar que no exista ya una resena para ese pedido y comprador
    const yaExiste = await Resena.findOne({
      where: {
        vendedorId,
        compradorId,
        pedidoId
      }
    });

    if (yaExiste) {
      return res.status(400).json({ mensaje: 'Ya dejaste una resena para este pedido.' });
    }

    const resena = await Resena.create({
      vendedorId,
      compradorId,
      comentario,
      calificacion,
      pedidoId
    });

    res.status(201).json({ mensaje: 'Resena creada', resena });
  } catch (error) {
    console.error('Error al crear resena:', error);
    res.status(500).json({ mensaje: 'Error al crear resena', error: error.message });
  }
};

const obtenerResenasPorVendedor = async (req, res) => {
  try {
    const { id } = req.params;

    const resenas = await Resena.findAll({
      where: { vendedorId: id },
      include: [{ model: Usuario, as: 'Comprador', attributes: ['id', 'nombreCompleto'] }]
    });

    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener resenas:', error);
    res.status(500).json({ mensaje: 'Error al obtener resenas' });
  }
};

module.exports = {
  crearResena,
  obtenerResenasPorVendedor,
  obtenerResenasPorComprador, // ✅ sin coma
};





