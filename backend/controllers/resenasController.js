// 📁 backend/controllers/resenasController.js

const { Resena, Usuario } = require('../models');
const dayjs = require("dayjs");

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

const responderResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const resena = await Resena.findByPk(id);
    if (!resena) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
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

    const haceMasDe24h = dayjs().diff(dayjs(resena.createdAt), 'hour') > 24;
    if (haceMasDe24h) {
      return res.status(403).json({ mensaje: "Solo se puede editar dentro de las 24h" });
    }

    resena.calificacion = calificacion || resena.calificacion;
    resena.comentario = comentario || resena.comentario;
    await resena.save();

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

const guardarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const resena = await Resena.findByPk(id);
    if (!resena) return res.status(404).json({ mensaje: 'Reseña no encontrada' });

    resena.respuestaVendedor = respuesta;
    await resena.save();

    res.json({ mensaje: 'Respuesta guardada', resena });
  } catch (error) {
    console.error('Error al guardar respuesta del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al guardar respuesta' });
  }
};

const actualizarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuestaVendedor } = req.body;

    if (!respuestaVendedor) {
      return res.status(400).json({ mensaje: 'Respuesta no puede estar vacía' });
    }

    const resena = await Resena.findByPk(id);
    if (!resena) return res.status(404).json({ mensaje: 'Reseña no encontrada' });

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
  obtenerUltimasPorProducto,
  editarResena,
  eliminarResena,
  responderResena,
  guardarRespuestaVendedor,
  actualizarRespuestaVendedor,
};
