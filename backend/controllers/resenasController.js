// 📁 backend/controllers/resenasController.js

const { Resena, Usuario, Producto, Pedido } = require('../models');
const dayjs = require("dayjs");
const { enviarCorreo } = require('../controllers/notificacionesController');
const { actualizarRankingDeVendedor } = require('../utils/actualizarRanking');
const { Op, fn, col } = require('sequelize');

const crearResena = async (req, res) => {
  try {
    const { vendedorId, productoId, comentario, calificacion, pedidoId } = req.body;
    const compradorId = req.usuario.id;

    if (!pedidoId || !productoId || !vendedorId) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos.' });
    }

    if (typeof calificacion !== 'number' || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5.' });
    }

    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    if (producto.vendedorId !== vendedorId) {
      return res.status(400).json({ mensaje: 'El producto no pertenece a ese vendedor.' });
    }

    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }

    if (pedido.compradorId !== compradorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para reseñar este pedido.' });
    }

    const yaExiste = await Resena.findOne({ where: { pedidoId } });
    if (yaExiste) {
      return res.status(400).json({ mensaje: 'Ya dejaste una reseña para este pedido.' });
    }

    const resena = await Resena.create({
      vendedorId,
      compradorId,
      comentario,
      calificacion,
      pedidoId,
      productoId
    });

    await actualizarRankingDeVendedor(vendedorId);

    res.status(201).json({ mensaje: 'Reseña creada', resena });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ mensaje: 'Error al crear reseña', error: error.message });
  }
};

// Obtener reseñas de un vendedor específico
const obtenerResenasPorVendedor = async (req, res) => {
  try {
    const { id } = req.params;

    const resenas = await Resena.findAll({
      where: { vendedorId: id },
      include: [{ model: Usuario, as: 'Comprador', attributes: ['id', 'nombreCompleto'] }]
    });

    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener resenas del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al obtener resenas' });
  }
};

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

// 📊 Obtener resumen mensual de reseñas de un vendedor
const obtenerResumenMensualResenas = async (req, res) => {
  const { id } = req.params;

  try {
    const resenas = await Resena.findAll({
      where: {
        vendedorId: id,
        createdAt: {
          [Op.gte]: dayjs().subtract(12, 'month').startOf('month').toDate()
        }
      },
      attributes: [
        [fn('strftime', '%Y-%m', col('createdAt')), 'mes'],
        [fn('COUNT', '*'), 'cantidad'],
        [fn('AVG', col('calificacion')), 'promedio']
      ],
      group: ['mes'],
      order: [[fn('strftime', '%Y-%m', col('createdAt')), 'ASC']]
    });

    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener resumen mensual de reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener resumen mensual' });
  }
};

// Verificar si ya existe una reseña para un pedido específico
const verificarSiYaReseno = async (req, res) => {
  try {
    const { compradorId, pedidoId } = req.params;

    if (!compradorId || !pedidoId || isNaN(Number(compradorId)) || isNaN(Number(pedidoId))) {
      return res.status(400).json({ mensaje: 'Parámetros inválidos' });
    }

    const yaExiste = await Resena.findOne({
      where: { compradorId, pedidoId }
    });

    res.json({ yaExiste: !!yaExiste });
  } catch (error) {
    console.error('Error al verificar existencia de reseña:', error);
    res.status(500).json({ mensaje: 'Error al verificar reseña' });
  }
};

const responderResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta || typeof respuesta !== 'string') {
      return res.status(400).json({ mensaje: "La respuesta no puede estar vacía" });
    }

    const resena = await Resena.findByPk(id);
    if (!resena) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }

    // Verificar que el usuario autenticado es el vendedor de esta reseña
    if (req.usuario.id !== resena.vendedorId) {
      return res.status(403).json({ mensaje: "No tienes permiso para responder esta reseña" });
    }

    if (resena.respuestaVendedor) {
      return res.status(400).json({ mensaje: "La reseña ya ha sido respondida" });
    }

    resena.respuestaVendedor = respuesta;
    await resena.save();

    res.json({ mensaje: "Respuesta enviada", resena });
  } catch (error) {
    console.error("Error al responder reseña:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

const editarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;

    const resena = await Resena.findByPk(id);
    if (!resena) return res.status(404).json({ mensaje: "Reseña no encontrada" });

    // Validar que el usuario es el comprador original
    if (req.usuario.id !== resena.compradorId) {
      return res.status(403).json({ mensaje: "No tienes permiso para editar esta reseña" });
    }

    if (resena.respuestaVendedor) {
      return res.status(403).json({ mensaje: "No se puede editar una reseña ya respondida" });
    }

    const haceMasDe24h = dayjs().diff(dayjs(resena.createdAt), 'hour') > 24;
    if (haceMasDe24h) {
      return res.status(403).json({ mensaje: "Solo se puede editar dentro de las 24h" });
    }

    if (typeof calificacion !== 'number' || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: "La calificación debe estar entre 1 y 5" });
    }

    if (comentario && typeof comentario !== 'string') {
      return res.status(400).json({ mensaje: "El comentario debe ser un texto válido" });
    }

    resena.calificacion = calificacion;
    resena.comentario = comentario || resena.comentario;
    await resena.save();

    await actualizarRankingDeVendedor(resena.vendedorId);

    res.json({ mensaje: "Reseña actualizada", resena });
  } catch (err) {
    console.error("Error al editar reseña:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

const eliminarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findByPk(id);

    if (!resena) return res.status(404).json({ mensaje: "Reseña no encontrada" });

    // Validar que el usuario es el comprador original
    if (req.usuario.id !== resena.compradorId) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar esta reseña" });
    }

    if (resena.respuestaVendedor) {
      return res.status(403).json({ mensaje: "No se puede eliminar una reseña ya respondida" });
    }

    await resena.destroy();
    res.json({ mensaje: "Reseña eliminada" });
  } catch (err) {
    console.error("Error al eliminar reseña:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

const guardarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta || typeof respuesta !== 'string') {
      return res.status(400).json({ mensaje: 'La respuesta no puede estar vacía' });
    }

    const resena = await Resena.findByPk(id);
    if (!resena) return res.status(404).json({ mensaje: 'Reseña no encontrada' });

    if (req.usuario.id !== resena.vendedorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para responder esta reseña' });
    }

    if (resena.respuestaVendedor) {
      return res.status(403).json({ mensaje: 'Ya respondiste esta reseña' });
    }

    resena.respuestaVendedor = respuesta;
    await resena.save();

    res.json({ mensaje: 'Respuesta guardada', resena });
  } catch (error) {
    console.error('Error al guardar respuesta del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al guardar respuesta del vendedor' });
  }
};

const actualizarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuestaVendedor } = req.body;

    if (!respuestaVendedor || typeof respuestaVendedor !== 'string') {
      return res.status(400).json({ mensaje: 'Respuesta no puede estar vacía' });
    }

    const resena = await Resena.findByPk(id);
    if (!resena) return res.status(404).json({ mensaje: 'Reseña no encontrada' });

    // Validar que el usuario es el vendedor original
    if (req.usuario.id !== resena.vendedorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar esta respuesta' });
    }

    if (resena.respuestaVendedor) {
      return res.status(403).json({ mensaje: 'Ya respondiste esta reseña' });
    }

    resena.respuestaVendedor = respuestaVendedor;
    await resena.save();

    res.json({ mensaje: 'Respuesta guardada', resena });
  } catch (error) {
    console.error('Error al guardar respuesta del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al guardar respuesta del vendedor' });
  }
};

const obtenerPorProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'ID de producto inválido' });
    }

    const resenas = await Resena.findAll({
      where: { productoId: id },
      include: [{ model: Usuario, as: 'Comprador', attributes: ['nombreCompleto'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(resenas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener reseñas del producto' });
  }
};

const obtenerUltimasPorProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'ID de producto inválido' });
    }

    const resenas = await Resena.findAll({
      where: { productoId: id },
      include: [{ model: Usuario, as: 'Comprador', attributes: ['nombreCompleto'] }],
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
  obtenerUltimasPorProducto,
  editarResena,
  eliminarResena,
  responderResena,
  guardarRespuestaVendedor,
  actualizarRespuestaVendedor,
  obtenerResumenMensualResenas,
};
