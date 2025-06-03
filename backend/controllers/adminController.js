// 📁 backend/controllers/adminController.js

const { Usuario, Producto, Pedido, Resena } = require('../models');
// const { Op } = require('sequelize'); // Op no se usa en este archivo actualmente

// Renombrado para claridad, usado en GET /api/admin/resumen
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
    res.status(500).json({ mensaje: 'Error al obtener resumen del dashboard', error: error.message });
  }
};

// Renombrado para claridad, usado en GET /api/admin/usuarios
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'correo', 'rol', 'estado', 'createdAt'], // Añadido createdAt si lo quieres
    });
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener todos los usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener todos los usuarios', error: error.message });
  }
};


// Esta función parece más para un reporte de ESTADO DE PEDIDOS, no reportes de usuarios.
// La mantengo pero considera si es lo que el frontend espera para la gráfica de estadísticas.
const obtenerReportesEstadoPedidos = async (req, res) => {
  try {
    const pendientes = await Pedido.count({ where: { estado: 'pendiente' } });
    const entregados = await Pedido.count({ where: { estado: 'entregado' } });
    const cancelados = await Pedido.count({ where: { estado: 'cancelado' } });

    res.json({ pendientes, entregados, cancelados });
  } catch (error)
 {
    console.error('❌ Error al obtener reportes de estado de pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes de estado de pedidos', error: error.message });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  // --- CAMBIO AQUÍ: Es buena práctica recibir el nuevo estado del body ---
  // --- O si es solo un toggle, el backend puede determinarlo, pero es menos RESTful ---
  // const { estado } = req.body; // Si el frontend envía el nuevo estado
  
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Lógica de Toggle (como la tenías)
    usuario.estado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
    
    // Si recibieras el estado del frontend:
    // if (estado && (estado === 'activo' || estado === 'bloqueado')) {
    //   usuario.estado = estado;
    // } else {
    //   return res.status(400).json({ mensaje: 'Valor de estado inválido.' });
    // }

    await usuario.save();

    res.json(usuario); // Devolver el usuario actualizado completo es útil para el frontend
  } catch (error) {
    console.error('❌ Error al cambiar estado de usuario:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario', error: error.message });
  }
};

// Nueva función para el ranking simulado (para mantener consistencia con el router)
const obtenerRankingVendedoresSimulado = async (req, res) => {
  try {
    // Tu lógica de datos simulados (o la real si la tienes)
    const vendedores = [
      { id: 5, nombre: 'Doña Marta', promedioCalificacion: 4.7, totalResenas: 28, totalProductos: 7, totalReportes: 1 },
      { id: 9, nombre: 'Tienda Ixchel', promedioCalificacion: 4.2, totalResenas: 15, totalProductos: 4, totalReportes: 0 }
    ];
    res.json(vendedores);
  } catch (error) {
    console.error('❌ Error al obtener ranking de vendedores (simulado):', error);
    res.status(500).json({ mensaje: 'Error al obtener ranking (simulado)', error: error.message });
  }
};


module.exports = {
  obtenerResumenDashboard,
  // obtenerUltimosUsuarios, // Esta no se estaba usando en adminRoutes.js, la comento.
                           // Si la necesitas, descomenta y añádela a una ruta.
  obtenerTodosLosUsuarios, // Renombrada
  obtenerReportesEstadoPedidos, // Nombre más específico
  cambiarEstadoUsuario,
  obtenerRankingVendedoresSimulado, // Nueva función
};

