// 📁 backend/routes/ai.routes.js

const express = require("express");
const router = express.Router();
const {
  generateCompletion,
  generarRecomendaciones,
  descripcionAtractivaProducto
} = require("../services/aiService");
const { InteraccionIA, Producto } = require("../models");

const usarOpenAI = process.env.USE_OPENAI === "true";

// POST /api/ia
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "⚠️ Se requiere un prompt válido (tipo string)." });
  }

  try {
    const respuesta = usarOpenAI
      ? await generateCompletion(prompt)
      : await generarRecomendaciones(prompt);
    res.json({ respuesta });
  } catch (err) {
    console.error("❌ Error en /api/ia:", err.message);
    res.status(500).json({ error: "Error al procesar la solicitud de IA." });
  }
});

// POST /api/ia/descripcion-producto
router.post("/descripcion-producto", async (req, res) => {
  const { productoId } = req.body;

  if (!productoId) {
    return res.status(400).json({ error: "ID del producto requerido" });
  }

  try {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const descripcion = await descripcionAtractivaProducto(producto);
    res.json({ descripcion });
  } catch (err) {
    console.error("❌ Error en /descripcion-producto:", err.message);
    res.status(500).json({ error: "Error generando descripción" });
  }
});

// GET /api/ia/historial
router.get("/historial", async (req, res) => {
  try {
    const historial = await InteraccionIA.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(historial);
  } catch (err) {
    console.error("❌ Error al obtener historial:", err);
    res.status(500).json({ error: "Error al obtener el historial" });
  }
});

module.exports = router;
