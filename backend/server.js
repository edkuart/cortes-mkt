// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { setupSwagger } = require('./swagger'); // 🧭 Swagger importado
const { sequelize, Usuario, Vendedor /* , otros modelos que necesites para seeders */ } = require('./models'); // Importa sequelize y modelos necesarios para seeder
const bcrypt = require('bcryptjs'); // Necesario para hashear contraseña en seeder

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Swagger Docs habilitado en /api-docs
setupSwagger(app); // 🧭 Swagger activado

// Importar rutas
const favoritosRoutes = require('./routes/favoritosRoutes');
const devolucionesRoutes = require('./routes/devolucionesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const aiRoutes = require('./routes/ai.routes');
const entregasRoutes = require('./routes/entregasRoutes');
const resenasRoutes = require('./routes/resenasRoutes');
const vendedoresRoutes = require('./routes/vendedoresRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');
const historialRoutes = require('./routes/historialRoutes');
const debugRoutes = require('./routes/debugRoutes'); // Considera si todas las rutas de debug son necesarias o si se pueden integrar en un seeder
const adminRoutes = require('./routes/adminRoutes');
const reportesRoutes = require('./routes/reportes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');

// Usar rutas
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/devoluciones', devolucionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ia', aiRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/entregas', entregasRoutes);
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/historial', historialRoutes);
app.use('/debug', debugRoutes); // Rutas de debug, considera su utilidad a largo plazo o si son para desarrollo
app.use('/api/admin', adminRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Bienvenido al Marketplace Modular Backend');
});

// Las rutas de debug para crear usuarios/pedidos podrían moverse a un script de "seeding"
// o mantenerse si son para pruebas rápidas durante el desarrollo.
// Ejemplo: app.get('/debug/crear-pedido', async (req, res) => { ... });
// (Manteniendo tus rutas de debug como las tenías por ahora)
app.get('/debug/crear-pedido', async (req, res) => {
  const { Pedido } = require('./models'); // Asegúrate que Pedido esté importado o definido

  const nuevo = await Pedido.create({
    compradorId: 1, // Asegúrate que este ID exista o maneja la creación
    total: 100,
    estado: 'pendiente',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.json(nuevo);
});

app.get('/debug/crear-usuario', async (req, res) => {
  try {
    const existente = await Usuario.findOne({ where: { correo: 'test@correo.com' } });
    if (existente) {
      return res.status(200).json({ mensaje: '⚠️ Usuario vendedor de prueba ya existe', usuario: existente });
    }
    const hash = await bcrypt.hash('123456', 10);
    const nuevoUsuario = await Usuario.create({
      nombreCompleto: 'Preda Welch', correo: 'test@correo.com', contraseña: hash, rol: 'vendedor'
    });
    await Vendedor.create({
      usuarioId: nuevoUsuario.id, telefono: '12345678', direccion: 'Zona 1, Xela', municipio: 'Quetzaltenango', departamento: 'Quetzaltenango', estado: 'pendiente'
    });
    res.status(201).json({ mensaje: '✅ Usuario vendedor de prueba y vendedor creados', usuario: nuevoUsuario });
  } catch (error) {
    console.error('❌ Error al crear usuario vendedor de prueba:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario vendedor de prueba', error: error.message });
  }
});

app.get('/debug/crear-comprador', async (req, res) => {
  try {
    const existente = await Usuario.findOne({ where: { correo: 'comprador@correo.com' } });
    if (existente) {
      return res.status(200).json({ mensaje: '⚠️ Comprador de prueba ya existe', usuario: existente });
    }
    const hash = await bcrypt.hash('123456', 10);
    const nuevoUsuario = await Usuario.create({
      nombreCompleto: 'Comprador Test', correo: 'comprador@correo.com', contraseña: hash, rol: 'comprador'
    });
    res.status(201).json({ mensaje: '✅ Comprador de prueba creado', usuario: nuevoUsuario });
  } catch (error) {
    console.error('❌ Error al crear comprador de prueba:', error);
    res.status(500).json({ mensaje: 'Error al crear comprador de prueba', error: error.message });
  }
});

app.get('/debug/pedidos', async (req, res) => {
  const { Pedido } = require('./models'); // Asegúrate que Pedido esté importado o definido
  const pedidos = await Pedido.findAll();
  res.json(pedidos);
});


// --- INICIO DE CAMBIOS IMPORTANTES ---

// Puerto y sincronización de base de datos
const PORT = process.env.PORT || 4000;

// Usar solo un bloque sequelize.sync
sequelize.sync({ force: process.env.NODE_ENV !== 'production' && true }) // Solo usar force:true en desarrollo
  .then(async () => {
    console.log("🟢 Base de datos sincronizada correctamente.");

    // --- INICIO: ASEGURAR USUARIO ADMIN ---
    const adminEmail = 'admincurl@example.com'; // El correo de tu admin
    const adminRawPassword = 'password123'; // La contraseña de tu admin

    try {
        let adminUser = await Usuario.findOne({ where: { correo: adminEmail } });
        if (!adminUser) {
          const adminPasswordHashed = await bcrypt.hash(adminRawPassword, 10);
          adminUser = await Usuario.create({
            nombreCompleto: 'Admin Curl (Sembrado)', // O el nombre que prefieras
            correo: adminEmail,
            contraseña: adminPasswordHashed,
            rol: 'admin'
          });
          console.log(`✅ Usuario administrador (${adminEmail}) creado por seeder.`);
        } else {
          // Opcional: Verificar y actualizar el rol si es necesario, o incluso la contraseña
          if (adminUser.rol !== 'admin') {
            adminUser.rol = 'admin';
            // Si también quieres actualizar la contraseña si el usuario ya existe:
            // adminUser.contraseña = await bcrypt.hash(adminRawPassword, 10);
            await adminUser.save();
            console.log(`🔄 Datos del usuario administrador (${adminEmail}) actualizados/verificados por seeder.`);
          } else {
            console.log(`ℹ️ Usuario administrador (${adminEmail}) ya existe y tiene rol "admin".`);
          }
        }
    } catch (seedError) {
        console.error("🔴 Error al sembrar usuario administrador:", seedError);
    }
    // --- FIN: ASEGURAR USUARIO ADMIN ---
    
    // (El código para mostrar estructura de tabla y rutas registradas se mantiene igual)
    const estructura = await sequelize.getQueryInterface().describeTable('productos');
    console.log("📊 Estructura de la tabla productos:");
    console.table(estructura);
    if (!estructura.promedioCalificacion) {
      console.warn("❌ promedioCalificacion NO está en la tabla. Revisa el modelo o el require.");
    } else {
      console.log("✅ promedioCalificacion está presente correctamente.");
    }

    app.listen(PORT, '0.0.0.0', () => { // Cambiado de 'server.listen' a 'app.listen'
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📘 Swagger disponible en http://localhost:${PORT}/api-docs`);

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
    // Asegúrate de que el proceso salga si la base de datos no puede sincronizarse
    process.exit(1);
  });

// EL SIGUIENTE BLOQUE HA SIDO ELIMINADO porque era redundante y problemático:
/*
const db = require('./models');
db.sequelize.sync({ force: true }).then(() => {
  console.log('🔁 Base de datos recreada correctamente');
});
*/
// --- FIN DE CAMBIOS IMPORTANTES ---