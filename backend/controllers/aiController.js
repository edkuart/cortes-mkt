// 🧠 controllers/aiController.js

const { Producto } = require('../models');
const { generateCompletion, descripcionAtractivaProducto } = require('../services/aiService');

// Ruta POST tradicional para texto libre
exports.generarRespuestaLibre = async (req, res) => {
  const { prompt } = req.body;
  console.log("Prompt recibido:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt requerido' });
  }

  try {
    const resultado = await generateCompletion(prompt);
    console.log("Respuesta generada:", resultado);
    res.json({ respuesta: resultado });
  } catch (err) {
    console.error("Error al generar respuesta:", err.message);
    res.status(500).json({ error: 'Error al generar respuesta de IA' });
  }
};

// Ruta POST para generar descripción atractiva de producto
exports.generarDescripcionProducto = async (req, res) => {
  try {
    const { productoId } = req.body;
    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const descripcion = await descripcionAtractivaProducto(producto);
    res.json({ descripcion });
  } catch (err) {
    console.error('Error al generar descripción IA:', err.message);
    res.status(500).json({ error: 'Error generando descripción del producto' });
  }
};