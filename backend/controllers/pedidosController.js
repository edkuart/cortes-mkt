// backend/controllers/pedidosController.js

const { Pedido, DetallePedido, Producto, Entrega } = require('../models');

// 🔍 Obtener todos los pedidos sin filtrar (incluyendo entrega y estado en texto)
const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [Producto],
        },
        {
          model: Entrega
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const pedidosConEstado = pedidos.map((pedido) => {
      const detalles = pedido.detalles || [];
    
      const total = detalles.reduce((acc, detalle) => {
        if (!detalle.producto) return acc;
        return acc + detalle.cantidad * detalle.producto.precio;
      }, 0);
    
      const primerProducto = detalles[0]?.producto;
      const vendedorId = primerProducto?.vendedorId || null;
    
      let estadoTexto = 'Pendiente';
      let mostrarBotonConfirmar = false;
      if (pedido.entrega) {
        const { confirmacionCliente, confirmacionRepartidor } = pedido.entrega;
        if (confirmacionCliente && confirmacionRepartidor) estadoTexto = 'Entregado';
        else if (confirmacionRepartidor) estadoTexto = 'En camino';
        else estadoTexto = 'Preparando envío';
    
        mostrarBotonConfirmar = !confirmacionCliente;
      }
    
      return {
        ...pedido.toJSON(),
        total,
        estadoTexto,
        mostrarBotonConfirmar,
        vendedorId
      };
    });    

    res.json(pedidosConEstado);
  } catch (error) {
    console.error("🔴 Error al obtener todos los pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
};

// Obtener pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        {
          model: DetallePedido,
          as: 'detalles',
          include: [Producto]
        },
        {
          model: Entrega
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    const total = pedido.detalles.reduce((acc, d) => {
      return acc + (d.cantidad * d.producto?.precio || 0);
    }, 0);

    let estadoTexto = 'Pendiente';
    if (pedido.entrega) {
      const { confirmacionCliente, confirmacionRepartidor } = pedido.entrega;
      if (confirmacionCliente && confirmacionRepartidor) estadoTexto = 'Entregado';
      else if (confirmacionRepartidor) estadoTexto = 'En camino';
      else estadoTexto = 'Preparando envío';
    }

    res.json({ ...pedido.toJSON(), total, estadoTexto });
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener el pedido' });
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

// Obtener todos los pedidos de un usuario con alias y total (incluyendo entrega y estado en texto)
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
        {
          model: Entrega
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const pedidosConEstado = pedidos.map((pedido) => {
      const detalles = pedido.detalles || [];
      const total = detalles.reduce((acc, detalle) => {
        if (!detalle.producto) return acc;
        return acc + detalle.cantidad * detalle.producto.precio;
      }, 0);

      let estadoTexto = 'Pendiente';
      let mostrarBotonConfirmar = false;
      if (pedido.entrega) {
        const { confirmacionCliente, confirmacionRepartidor } = pedido.entrega;
        if (confirmacionCliente && confirmacionRepartidor) estadoTexto = 'Entregado';
        else if (confirmacionRepartidor) estadoTexto = 'En camino';
        else estadoTexto = 'Preparando envío';

        mostrarBotonConfirmar = !confirmacionCliente;
      }

      return { ...pedido.toJSON(), total, estadoTexto, mostrarBotonConfirmar };
    });

    res.json(pedidosConEstado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
  }
};

// Obtener pedidos del vendedor autenticado
const obtenerPedidosPorVendedor = async (req, res) => {
  try {
    const vendedorId = req.usuario.id;

    const pedidos = await Pedido.findAll({
      where: { vendedorId },
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [Producto],
        },
        {
          model: Entrega
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos del vendedor.' });
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
  obtenerPedidosPorVendedor,
  obtenerPedidoPorId,
};
