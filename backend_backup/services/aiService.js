// backend/services/aiService.js

let openai = null;
try {
  if (process.env.USE_OPENAI === 'true') {
    openai = require('./openaiClient');
  }
} catch (error) {
  console.warn("⚠️ No se pudo cargar OpenAI. La IA estará desactivada.");
}

const InteraccionIA = require('../models/InteraccionIA');

async function generateCompletion(prompt) {
  if (!openai) {
    const mensaje = "🔕 OpenAI está deshabilitado o no se pudo cargar.";
    console.warn(mensaje);
    return mensaje;
  }

  try {
    console.log("Enviando solicitud a OpenAI con prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const respuesta = response.choices[0].message.content.trim();

    await InteraccionIA.create({
      prompt,
      respuesta,
    });

    return respuesta;
  } catch (err) {
    console.error("🔴 Error al interactuar con OpenAI:", err);
    throw err;
  }
}

function filtrarCortes(preferencia, cortes) {
  return cortes.filter(c => c.nombre.toLowerCase().includes(preferencia.toLowerCase()));
}

async function generarRecomendaciones(preferencia) {
  const cortes = [
    { id: 1, nombre: "Corte tradicional de Totonicapán", precio: 250 },
    { id: 2, nombre: "Corte de Salcajá bordado a mano", precio: 300 },
    { id: 3, nombre: "Corte moderno estilo urbano", precio: 275 },
    { id: 4, nombre: "Corte ceremonial con bordado dorado", precio: 350 },
  ];

  const recomendados = filtrarCortes(preferencia, cortes);

  await InteraccionIA.create({
    prompt: preferencia,
    respuesta: JSON.stringify(recomendados),
  });

  return recomendados;
}

module.exports = {
  generateCompletion,
  generarRecomendaciones,
};

