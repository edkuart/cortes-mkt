// 📦 backend/routes/ai.routes.js

const express = require("express");
const router = express.Router();
const {
  generateCompletion,
  generarRecomendaciones,
} = require("../services/aiService");
const InteraccionIA = require('../models/InteraccionIA');

const usarOpenAI = process.env.USE_OPENAI === "true";

// POST /api/ia
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res
      .status(400)
      .json({ error: "⚠️ Se requiere un prompt válido (tipo string)." });
  }

  try {
    if (usarOpenAI) {
      const respuesta = await generateCompletion(prompt);
      res.json({ respuesta });
    } else {
      const respuesta = await generarRecomendaciones(prompt);
      res.json({ respuesta });
    }
  } catch (err) {
    console.error("❌ Error en /api/ia:", err.message);
    res.status(500).json({ error: "Error al procesar la solicitud de IA." });
  }
});

// GET /api/ia/historial
router.get('/historial', async (req, res) => {
  try {
    const historial = await InteraccionIA.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(historial);
  } catch (err) {
    console.error('❌ Error al obtener historial:', err);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});


module.exports = router;


