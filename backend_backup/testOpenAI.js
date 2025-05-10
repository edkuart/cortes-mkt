const axios = require('axios');

const apiKey = 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';  // Reemplaza con tu clave real
const url = 'https://api.openai.com/v1/completions';

axios.post(url, {
  model: "text-davinci-003",
  prompt: "Recomiéndame un corte moderno",
  max_tokens: 100
}, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log("Respuesta de OpenAI:", response.data);
})
.catch(error => {
  console.error("Error al hacer la solicitud a OpenAI:", error.response ? error.response.data : error.message);
});


