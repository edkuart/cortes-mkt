# 📦 Backend - Marketplace Modular

Este proyecto representa el backend de un marketplace modular creado con **Node.js**, **Express**, y **Sequelize (SQLite)**. Ahora incluye funcionalidades para manejar productos, usuarios, pedidos, autenticación, reseñas, devoluciones y notificación por correo electrónico.

---

## 🚀 Tecnologías Utilizadas

- Node.js
- Express.js
- Sequelize ORM
- SQLite (base de datos)
- OpenAI (API)
- Nodemailer (notificaciones por correo)
- dotenv
- nodemon (desarrollo)
- day.js (fechas)
- bcryptjs
- Cors + JWT
- Google Auth Library (OAuth2.0)

---

## 📁 Estructura del Proyecto

```
backend/
├── server.js                         # 🚀 Servidor principal Express
├── database.sqlite                   # 🗂 Base de datos SQLite
├── package.json                      # 📦 Configuración del proyecto
├── .env                              # 🔐 Variables de entorno
│
├── config/
│   └── db.js                         # ⚙️ Configuración de Sequelize
│
├── controllers/
│   ├── aiController.js              # 🤖 Lógica para IA
│   ├── authController.js            # 🔐 Login y registro tradicional
│   ├── authGoogleController.js      # 🔐 Login con Google OAuth
│   ├── devolucionesController.js    # 📦 Controlador de devoluciones
│   ├── entregasController.js        # 🚚 Controlador de entregas
│   ├── historialController.js       # 📜 Obtener historial de cambios de producto
│   ├── mensajesController.js        # 💬 Mensajes entre usuarios
│   ├── notificacionesController.js  # 🔔 Lógica para enviar notificaciones (ej: por email)
│   ├── pedidosController.js         # 📥 Controlador de pedidos
│   ├── productosController.js       # 🛍 Controlador principal de productos
│   ├── resenasController.js         # ✍️ Controlador de reseñas
│   ├── usuariosController.js        # 👤 Perfil, cambio de datos y contraseña
│   └── vendedoresController.js      # 🧑‍💼 Controlador del panel vendedor
│
├── middleware/
│   ├── authMiddleware.js            # 🔐 Protege rutas según rol
│   ├── uploadMiddleware.js          # 📤 Multer para imágenes
│   └── verificarToken.js            # ✅ Verifica JWT y pasa `req.usuario`
│
├── models/
│   ├── index.js                     # 🔗 Inicializa Sequelize y relaciones
│   ├── detallePedido.model.js       # 📦 Detalles de productos por pedido
│   ├── devolucion.js                # 🔁 Modelo de devoluciones
│   ├── entrega.model.js             # 🚚 Modelo de entregas
│   ├── historialProducto.js         # 📝 Modelo para registrar cambios de productos
│   ├── interaccionIA.model.js       # 🧠 Interacciones con la IA
│   ├── mensaje.model.js             # 💬 Mensajes entre usuarios
│   ├── pedido.model.js              # 🛒 Pedidos
│   ├── producto.model.js            # 🛍 Productos en venta
│   ├── rankingVendedor.model.js     # 🏅 Métricas de vendedor
│   ├── resena.model.js              # ✍️ Opiniones de productos
│   ├── usuario.model.js             # 👤 Usuarios base
│   └── vendedor.model.js            # 🧑‍💼 Datos adicionales para vendedores
│
├── routes/
│   ├── ai.routes.js                 # 🔀 Ruta para IA
│   ├── authRoutes.js                # 🔀 Login y registro
│   ├── pedidosRoutes.js             # 🔀 Rutas de pedidos
│   ├── productosRoutes.js           # 🔀 Rutas de productos
│   ├── resenasRoutes.js             # 🔀 Rutas de reseñas
│   ├── devolucionesRoutes.js        # 🔀 Devoluciones
│   ├── notificacionesRoutes.js      # 🔀 Notificaciones (email, etc)
│   └── mensajesRoutes.js            # 🔀 Chat y conversaciones
│
├── services/
│   ├── aiService.js                 # 🤖 Integración de IA
│   └── openaiClient.js              # 🔑 Configuración OpenAI
│
├── migrations/                      # 🧬 (opcional) Migraciones futuras si decides usar CLI
├── node_modules/
└── tests/                           # 🧪 (opcional) Tests unitarios o integrados

```

frontend/
├── components/
│   ├── Form/
│   │   ├── InputArchivo.tsx          # 📤 Input especializado para archivos (vendedor)
│   │   ├── InputText.tsx             # 🧾 Reutilizable para inputs de texto/email/password
│   │   └── SelectRol.tsx             # 👤 Selector de rol (comprador/vendedor)
│   ├── Estrellas.tsx                 # ⭐ Visualizador de calificación
│   ├── IAResponseBox.tsx             # 🤖 Respuestas generadas por IA
│   ├── Layout.tsx                    # 🧱 Layout general (si aplica)
│   ├── PedidoCard.tsx                # 🧾 Vista individual de un pedido
│   ├── PedidoForm.tsx                # 📥 Formulario de solicitud
│   ├── ProductoCard.tsx              # 🛍 Vista individual de producto
│   ├── ProductoForm.tsx              # 🧾 Formulario para crear producto
│   ├── ReseñasBox.tsx                # ✍️ Caja para ver y dejar reseñas
│   └── SolicitarDevolucion.tsx       # 📦 Solicitud de devolución
│
├── hooks/
│   ├── useAuth.ts                    # 🔐 Autenticación con token localStorage
│   ├── useIA.ts                      # ⚙️ Llamadas a la IA
│   └── useResenasProducto.ts         # 🔁 Hook para reseñas públicas de producto
│
├── pages/
│   ├── api/
│   │   └── hello.ts
│   ├── comprador/
│   │   ├── carrito.tsx
│   │   ├── crear-resena.tsx
│   │   ├── editar-resena.tsx
│   │   ├── mis-pedidos.tsx
│   │   └── mis-resenas.tsx
│   ├── resenas-producto/
│   │   ├── [id].tsx
│   │   └── resumen.tsx
│   ├── vendedor/
│   │   ├── dashboard-vendedor.tsx
│   │   ├── panel-vendedor.tsx
│   │   ├── Pedidos-Vendedor.tsx
│   │   ├── responder-resenas.tsx
│   │   └── resumen-resenas.tsx
│   ├── _app.tsx                      # 🌐 Configura GoogleOAuthProvider
│   ├── _document.tsx
│   ├── ia.tsx
│   ├── index.tsx
│   ├── login.tsx                     # 🔐 Incluye login tradicional y con Google
│   └── registro.tsx                  # ✅ Registro tradicional y con Google
│
├── public/
│   └── (imágenes, íconos, etc.)
│
├── services/
│   └── apiService.ts
│
├── styles/
│   └── globals.css
│
├── utils/
│   └── estrellas.ts
│
├── .env.local                        # ⚙️ Incluye NEXT_PUBLIC_GOOGLE_CLIENT_ID
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

🔧 Configuración Inicial

    Instalar dependencias:

npm install

    Configurar .env:

PORT=4000
JWT_SECRET=clave_secreta
OPENAI_API_KEY=sk-xxxx
USE_OPENAI=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_app
ADMIN_EMAIL=correo_admin@gmail.com
EMAIL_FROM=Marketplace <tu_correo@gmail.com>
GOOGLE_CLIENT_ID=tu_google_client_id

    Iniciar servidor:

npm run dev

🔗 Rutas y Endpoints Principales
✅ Autenticación

    POST /api/auth/login

    POST /api/auth/registro

    POST /api/auth/login-google

👤 Usuarios

    GET /api/usuarios

    POST /api/usuarios

    PATCH /api/usuarios/:id

📦 Productos

    GET /api/productos

    POST /api/productos

    DELETE /api/productos/:id

🛒 Pedidos

    GET /api/pedidos

    GET /api/pedidos/usuario/:id

    POST /api/pedidos

💬 Reseñas

    GET /api/resenas/vendedor/:id

    GET /api/resenas/comprador/:id

    GET /api/resenas/producto/:id

    POST /api/resenas ← Crea reseña

    PATCH /api/resenas/:id ← Edita dentro de 24h

    DELETE /api/resenas/:id ← Solo si no ha sido respondida

    GET /api/resenas/verificar/:compradorId/:pedidoId ← Verifica si ya reseñó

🗨 Respuestas del Vendedor

    Campo respuestaVendedor en reseñas

    Rutas incluidas en PATCH /api/resenas/:id

    Restricción: solo una vez

📧 Notificaciones

    POST /api/notificaciones/correo

    Se envía correo automático al vendedor con cada nueva reseña

    Si la calificación es menor a 3, se marca como urgente

🛠 Consideraciones

    Base de datos se sincroniza automáticamente.

    Se puede forzar reseteo con:
```js
sequelize.sync({ force: true })
```

    La lógica de notificación por correo está desacoplada y puede reutilizarse en otras acciones (como devoluciones).

---

🔥 Funcionalidades Nuevas

- ✏️ **Editar reseñas** (dentro de 24h)
- 🗑️ **Eliminar reseñas** (si no tienen respuesta)
- 💬 **Responder reseñas por parte del vendedor**
- 🧹 **Moderación de respuestas (antispam e insultos)**
- 📩 **Notificación automática al recibir reseñas**
- 📊 **Ranking e historial de calificaciones**
- ✅ **Control por rol (comprador vs. vendedor)**
- 🔐 **Login con Google integrado (OAuth 2.0)**
+ Campo fotoPerfil y fotoUrl en respuesta de usuario
+ Middleware verificarToken (para rutas protegidas)
+ Ruta pública para imágenes uploads/perfiles (servida desde Express)
---

📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Proyecto creado con fines educativos, con posibilidad de integrarse en aplicaciones móviles y futuras mejoras como notificaciones avanzadas y funciones de marketing.

