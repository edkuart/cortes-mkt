const Producto = require('../models/producto.model');

// GET todos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// GET por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error('Error al buscar producto:', error);
    res.status(500).json({ mensaje: 'Error al buscar producto' });
  }
};

// POST nuevo
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
    const nuevo = await Producto.create({ nombre, descripcion, precio, stock, categoria, imagen });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// PUT actualizar
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    await producto.update({ nombre, descripcion, precio, stock, categoria, imagen });
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// DELETE eliminar
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};

