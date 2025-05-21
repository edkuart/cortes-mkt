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

    // ✅ Marcar como leídos los mensajes recibidos
    await Mensaje.update(
      { leido: true },
      {
        where: {
          emisorId: receptorId,
          receptorId: emisorId,
          leido: false,
        },
      }
    );

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
      leido: false
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
  }
};

// 🔎 Buscar vendedor y redirigir a contacto
exports.iniciarConversacionConVendedor = async (req, res) => {
  const { productoId } = req.params;

  try {
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const vendedor = await Vendedor.findOne({ where: { id: producto.vendedorId } });
    if (!vendedor) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

    const usuario = await Usuario.findByPk(vendedor.usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario vendedor no encontrado' });

    // 🧾 Lenguaje más claro: "Contacto con el vendedor"
    res.json({ vendedorId: usuario.id, nombre: usuario.nombreCompleto, accion: 'Contacto con el vendedor' });
  } catch (error) {
    console.error('❌ Error al iniciar conversación:', error);
    res.status(500).json({ mensaje: 'Error al obtener vendedor' });
  }
};

// ✅ Nueva ruta auxiliar: para verificar conexión
exports.pingMensajes = (req, res) => {
  res.send('📨 Endpoint de mensajes operativo');
};

// 🟢 Obtener lista de conversaciones activas del usuario autenticado
exports.obtenerConversaciones = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { emisorId: usuarioId },
          { receptorId: usuarioId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    const conversacionesMap = new Map();

    mensajes.forEach(m => {
      const otro = m.emisorId === usuarioId ? m.receptorId : m.emisorId;
      if (!conversacionesMap.has(otro)) {
        conversacionesMap.set(otro, m);
      }
    });

    const usuariosIds = Array.from(conversacionesMap.keys());
    const usuarios = await Usuario.findAll({
      where: { id: usuariosIds },
      attributes: ['id', 'nombreCompleto']
    });

    const conversaciones = usuarios.map(u => {
      const ultimoMensaje = conversacionesMap.get(u.id);
      return {
        id: u.id,
        nombre: u.nombreCompleto,
        ultimoMensaje: ultimoMensaje.contenido,
        fecha: ultimoMensaje.createdAt,
        leido: ultimoMensaje.receptorId !== usuarioId || ultimoMensaje.leido
      };
    });

    res.json(conversaciones);
  } catch (error) {
    console.error('❌ Error al listar conversaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener conversaciones' });
  }
};
