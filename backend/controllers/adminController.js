// 📁 backend/controllers/adminController.js

const { Usuario, Producto, Pedido, Resena } = require('../models');
const { Op } = require('sequelize');

const obtenerResumenDashboard = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count();
    const totalProductos = await Producto.count();
    const totalPedidos = await Pedido.count();
    const totalResenas = await Resena.count();

    res.json({
      totalUsuarios,
      totalProductos,
      totalPedidos,
      totalResenas,
    });
  } catch (error) {
    console.error('❌ Error al obtener resumen del dashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener resumen del dashboard' });
  }
};

const obtenerUltimosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
    });
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener últimos usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener últimos usuarios' });
  }
};

const obtenerReportesPorEstado = async (req, res) => {
  try {
    const pendientes = await Pedido.count({ where: { estado: 'pendiente' } });
    const entregados = await Pedido.count({ where: { estado: 'entregado' } });
    const cancelados = await Pedido.count({ where: { estado: 'cancelado' } });

    res.json({ pendientes, entregados, cancelados });
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes de pedidos' });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.estado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
    await usuario.save();

    res.json({ estado: usuario.estado });
  } catch (error) {
    console.error('❌ Error al cambiar estado de usuario:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario' });
  }
};

module.exports = {
  obtenerResumenDashboard,
  obtenerUltimosUsuarios,
  obtenerReportesPorEstado,
  cambiarEstadoUsuario,
};

