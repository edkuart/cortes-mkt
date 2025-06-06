// 📁 backend/controllers/adminController.js

const { Usuario, Producto, Pedido, Resena } = require('../models');

const obtenerResumenDashboard = async (req, res) => {
  console.log("✅ [AdminController] Entrando a obtenerResumenDashboard...");
  try {
    const totalUsuarios = await Usuario.count();
    const totalProductos = await Producto.count();
    const totalPedidos = await Pedido.count();
    const totalResenas = await Resena.count();

    console.log("✅ [AdminController] Resumen calculado:", { totalUsuarios, totalProductos, totalPedidos, totalResenas });
    res.json({
      totalUsuarios,
      totalProductos,
      totalPedidos,
      totalResenas,
    });
  } catch (error) {
    console.error('❌ [AdminController] Error en obtenerResumenDashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener resumen del dashboard', error: error.message });
  }
};

const obtenerTodosLosUsuarios = async (req, res) => {
  console.log("✅ [AdminController] Entrando a obtenerTodosLosUsuarios...");
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'correo', 'rol', 'estado', 'createdAt'],
    });
    console.log(`✅ [AdminController] Usuarios encontrados: ${usuarios.length}`);
    res.json(usuarios);
  } catch (error) {
    console.error('❌ [AdminController] Error en obtenerTodosLosUsuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener todos los usuarios', error: error.message });
  }
};

const obtenerReportesEstadoPedidos = async (req, res) => {
  console.log("✅ [AdminController] Entrando a obtenerReportesEstadoPedidos...");
  try {
    const pendientes = await Pedido.count({ where: { estado: 'pendiente' } });
    const entregados = await Pedido.count({ where: { estado: 'entregado' } });
    const cancelados = await Pedido.count({ where: { estado: 'cancelado' } });
    console.log("✅ [AdminController] Estado de pedidos calculado:", { pendientes, entregados, cancelados });
    res.json({ pendientes, entregados, cancelados });
  } catch (error) {
    console.error('❌ [AdminController] Error en obtenerReportesEstadoPedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes de estado de pedidos', error: error.message });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  console.log(`✅ [AdminController] Entrando a cambiarEstadoUsuario para ID: ${id}`);
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      console.warn(`⚠️ [AdminController] Usuario no encontrado para cambiar estado: ID ${id}`);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const estadoAnterior = usuario.estado;
    usuario.estado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
    await usuario.save();
    console.log(`✅ [AdminController] Estado de usuario ID ${id} cambiado de ${estadoAnterior} a ${usuario.estado}`);
    res.json(usuario); // Devuelve el usuario actualizado completo
  } catch (error) {
    console.error(`❌ [AdminController] Error en cambiarEstadoUsuario para ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario', error: error.message });
  }
};

const obtenerRankingVendedoresSimulado = async (req, res) => {
  console.log("✅ [AdminController] Entrando a obtenerRankingVendedoresSimulado...");
  try {
    const vendedores = [
      { id: 5, nombre: 'Doña Marta', promedioCalificacion: 4.7, totalResenas: 28, totalProductos: 7, totalReportes: 1 },
      { id: 9, nombre: 'Tienda Ixchel', promedioCalificacion: 4.2, totalResenas: 15, totalProductos: 4, totalReportes: 0 }
    ];
    console.log("✅ [AdminController] Ranking simulado generado.");
    res.json(vendedores);
  } catch (error) {
    console.error('❌ [AdminController] Error en obtenerRankingVendedoresSimulado:', error);
    res.status(500).json({ mensaje: 'Error al obtener ranking (simulado)', error: error.message });
  }
};

module.exports = {
  obtenerResumenDashboard,
  obtenerTodosLosUsuarios,
  obtenerReportesEstadoPedidos,
  cambiarEstadoUsuario,
  obtenerRankingVendedoresSimulado,
};