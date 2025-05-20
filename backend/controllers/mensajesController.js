// 📁 backend/controllers/mensajesController.js

const { Mensaje, Usuario, Producto, Vendedor } = require('../models');
const { Op } = require('sequelize');

// 📩 Obtener todos los mensajes entre el usuario autenticado y otro usuario
exports.obtenerMensajes = async (req, res) => {
  const emisorId = req.usuario.id;
  const receptorId = parseInt(req.params.otroUsuarioId);

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { emisorId, receptorId },
          { emisorId: receptorId, receptorId: emisorId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
};

// ✉️ Enviar un nuevo mensaje
exports.enviarMensaje = async (req, res) => {
  const emisorId = req.usuario.id;
  const { receptorId, contenido } = req.body;

  try {
    const receptorExiste = await Usuario.findByPk(receptorId);
    if (!receptorExiste) {
      return res.status(404).json({ mensaje: 'Receptor no encontrado' });
    }

    const nuevoMensaje = await Mensaje.create({
      emisorId,
      receptorId,
      contenido,
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
  }
};

// 🔎 Buscar vendedor y redirigir al chat
exports.iniciarConversacionConVendedor = async (req, res) => {
  const { productoId } = req.params;

  try {
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const vendedor = await Vendedor.findOne({ where: { id: producto.vendedorId } });
    if (!vendedor) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

    res.json({ vendedorId: vendedor.usuarioId });
  } catch (error) {
    console.error('❌ Error al iniciar conversación:', error);
    res.status(500).json({ mensaje: 'Error al obtener vendedor' });
  }
};

// ✅ Nueva ruta auxiliar: para verificar conexión
exports.pingMensajes = (req, res) => {
  res.send('📬 Endpoint de mensajes operativo');
};
