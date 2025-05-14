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

// Verificar si ya existe una reseña para un pedido específico
const verificarSiYaReseno = async (req, res) => {
  try {
    const { compradorId, pedidoId } = req.params;

    const yaExiste = await Resena.findOne({
      where: { compradorId, pedidoId }
    });

    res.json({ yaExiste: !!yaExiste });
  } catch (error) {
    console.error('Error al verificar existencia de reseña:', error);
    res.status(500).json({ mensaje: 'Error al verificar reseña' });
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

const obtenerPorProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const resenas = await Resena.findAll({
      where: { productoId: id },
      include: [{ model: Usuario, attributes: ['nombreCompleto'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(resenas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener reseñas del producto' });
  }
};

const obtenerUltimasPorProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const resenas = await Resena.findAll({
      where: { productoId: id },
      include: [{ model: Usuario, attributes: ['nombreCompleto'] }],
      order: [['createdAt', 'DESC']],
      limit: 2
    });
    res.json(resenas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener reseñas recientes del producto' });
  }
};

module.exports = {
  crearResena,
  obtenerResenasPorVendedor,
  obtenerResenasPorComprador,
  verificarSiYaReseno,
  obtenerPorProducto,
  obtenerUltimasPorProducto
};
