// backend/controllers/productosController.js

const Pedido = require('../models/pedido.model');
const { Producto, Resena, HistorialProducto } = require('../models');
const { Op } = require('sequelize');

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
    const productos = await Producto.findAll({
      attributes: ['id', 'nombre', 'precio', 'imagen', 'vendedorId'],
    });

    const productosConPromedios = await Promise.all(productos.map(async (p) => {
      const resenas = await Resena.findAll({ where: { productoId: p.id } });
      const cantidad = resenas.length;
      const promedio = cantidad > 0 ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / cantidad : 0;
      return {
        ...p.toJSON(),
        promedioCalificacion: parseFloat(promedio.toFixed(1)),
        cantidadResenas: cantidad
      };
    }));

    res.json(productosConPromedios);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
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

    res.status(201).json({ mensaje: 'Producto creado correctamente', producto: nuevoProducto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
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

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const cambios = [];
    const campos = ['nombre', 'descripcion', 'precio', 'stock', 'categoria', 'vendedorId'];

    for (const campo of campos) {
      if (req.body[campo] !== undefined && req.body[campo] != producto[campo]) {
        cambios.push({
          productoId: producto.id,
          campo,
          valorAnterior: String(producto[campo]),
          valorNuevo: String(req.body[campo])
        });
        producto[campo] = req.body[campo];
      }
    }

    if (req.file && req.file.path !== producto.imagen) {
      cambios.push({
        productoId: producto.id,
        campo: 'imagen',
        valorAnterior: String(producto.imagen),
        valorNuevo: String(req.file.path)
      });
      producto.imagen = req.file.path;
    }

    await producto.save();

    const usuario = req.usuario?.nombreCompleto || 'Desconocido';

    let historialGuardado = [];
    if (cambios.length > 0) {
      historialGuardado = await Promise.all(cambios.map(async (c) => {
        return await HistorialProducto.create({
          productoId: c.productoId,
          campo: c.campo,
          valorAnterior: c.valorAnterior,
          valorNuevo: c.valorNuevo,
          usuarioNombre: usuario,
          imagenAnterior: c.campo === 'imagen' ? `http://localhost:4000/${c.valorAnterior}` : null,
          imagenNueva: c.campo === 'imagen' ? `http://localhost:4000/${c.valorNuevo}` : null
        });
      }));
    }

    res.json({ producto, historial: historialGuardado });
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

const obtenerPromedioCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const resenas = await Resena.findAll({ where: { productoId: id } });
    if (resenas.length === 0) {
      return res.json({ promedio: 0, cantidad: 0 });
    }
    const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0);
    const promedio = suma / resenas.length;
    res.json({ promedio: promedio.toFixed(1), cantidad: resenas.length });
  } catch (error) {
    console.error('Error al calcular promedio:', error);
    res.status(500).json({ mensaje: 'Error al calcular promedio' });
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
  eliminarProducto,
  obtenerPromedioCalificacion
};