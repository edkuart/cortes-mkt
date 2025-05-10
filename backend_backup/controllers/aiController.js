// 🧠 controllers/aiController.js - Maneja solicitudes de IA desde el frontend

const express = require('express');
const router = express.Router();
const { generateCompletion } = require('../services/aiService');

// Ruta POST para generar respuesta de IA
router.post('/ia', async (req, res) => {
  const { prompt } = req.body;
  console.log("Prompt recibido:", prompt); // Agregar un log para depurar

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt requerido' });
  }

  try {
    const resultado = await generateCompletion(prompt);
    console.log("Respuesta generada:", resultado); // Log para ver la respuesta generada
    res.json({ respuesta: resultado });
  } catch (err) {
    console.error("Error al generar respuesta:", err.message);
    res.status(500).json({ error: 'Error al generar respuesta de IA' });
  }
});


module.exports = router;