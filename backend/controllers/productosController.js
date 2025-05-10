// backend/controllers/productosController.js

const Pedido = require('../models/pedido.model');
const { Producto } = require('../models');

// Crear nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { compradorId, productos } = req.body;
    let total = 0;
    const detalles = [];

    for (const item of productos) {
      const producto = await Producto.findByPk(item.productoId);
      if (!producto) return res.status(404).json({ mensaje: `Producto ${item.productoId} no encontrado` });

      total += producto.precio * item.cantidad;
      detalles.push({ productoId: item.productoId, cantidad: item.cantidad, precioUnitario: producto.precio });
    }

    const pedido = await Pedido.create({ compradorId, total });
    res.status(201).json({ mensaje: 'Pedido creado', pedidoId: pedido.id });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear el pedido' });
  }
};

const obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidos = await Pedido.findAll({ where: { compradorId: id } });
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

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

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, vendedorId } = req.body;
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      vendedorId,
      imagen: req.file ? req.file.path : null
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const camposActualizados = {
      nombre: req.body.nombre || producto.nombre,
      descripcion: req.body.descripcion || producto.descripcion,
      precio: req.body.precio || producto.precio,
      stock: req.body.stock || producto.stock,
      categoria: req.body.categoria || producto.categoria,
      vendedorId: req.body.vendedorId || producto.vendedorId
    };

    if (req.file) {
      camposActualizados.imagen = req.file.path;
    }

    await producto.update(camposActualizados);
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  crearPedido,
  obtenerPedidosPorUsuario,
  cambiarEstadoPedido,
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};

