// backend/controllers/pedidosController.js

const { Pedido, DetallePedido, Producto } = require('../models');

// 🔍 Obtener todos los pedidos sin filtrar (temporal para depurar)
const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [Producto],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(pedidos);
  } catch (error) {
    console.error("🔴 Error al obtener todos los pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
};

// Crear nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { compradorId, productos } = req.body; // productos = [{ productoId, cantidad }]

    let total = 0;
    const detalles = [];

    for (const item of productos) {
      const producto = await Producto.findByPk(item.productoId);
      if (!producto) return res.status(404).json({ mensaje: `Producto ${item.productoId} no encontrado` });

      total += producto.precio * item.cantidad;

      detalles.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      });
    }

    const pedido = await Pedido.create({ compradorId, total });

    for (const d of detalles) {
      await DetallePedido.create({ ...d, pedidoId: pedido.id });
    }

    res.status(201).json({ mensaje: 'Pedido creado', pedidoId: pedido.id });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear el pedido' });
  }
};

// Obtener todos los pedidos de un usuario con alias y total
const obtenerPedidosPorUsuario = async (req, res) => {
  console.log("🟡 Entrando a obtenerPedidosPorUsuario para el ID:", req.params.id);
  try {
    const pedidos = await Pedido.findAll({
      where: { compradorId: req.params.id },
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [Producto],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const pedidosConTotal = pedidos.map((pedido) => {
      const detalles = pedido.detalles || [];
      const total = detalles.reduce((acc, detalle) => {
        if (!detalle.producto) return acc;
        return acc + detalle.cantidad * detalle.producto.precio;
      }, 0);
      return { ...pedido.toJSON(), total };
    });

    res.json(pedidosConTotal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
  }
};

// Cambiar estado del pedido
const cambiarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

    pedido.estado = estado;
    await pedido.save();

    res.json({ mensaje: 'Estado actualizado', nuevoEstado: estado });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido' });
  }
};

module.exports = {
  crearPedido,
  obtenerPedidosPorUsuario,
  cambiarEstadoPedido,
  obtenerTodosLosPedidos,
};

