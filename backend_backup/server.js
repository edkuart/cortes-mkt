// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const reseñasRoutes = require('./routes/reseñasRoutes');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const aiRoutes = require('./routes/ai.routes');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/reseñas', reseñasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ia', aiRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Bienvenido al Marketplace Modular Backend');
});

// Puerto y sincronización de base de datos
const PORT = process.env.PORT || 4000;
const sequelize = require('./config/db');

sequelize.sync()
  .then(() => {
    console.log("🟢 Base de datos sincronizada correctamente");
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

      try {
        const rutas = app._router?.stack
          .filter(r => r.route)
          .map(r =>
            `➡ Ruta registrada: ${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`
          );

        rutas?.forEach(r => console.log(r));
      } catch (e) {
        console.warn("⚠ No se pudo mostrar las rutas registradas:", e.message);
      }
    });
  })
  .catch((error) => {
    console.error("🔴 Error al sincronizar la base de datos:", error);
  });






