# 📦 Marketplace Modular - Backend

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

---

## 📁 Estructura del Proyecto

```
backend/
├── server.js
├── database.sqlite
├── package.json
├── .env
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── pedidosController.js
│   ├── productosController.js
│   ├── resenasController.js
│   ├── devolucionesController.js
│   └── notificacionesController.js
├── models/
│   ├── index.js
│   ├── detallePedido.model.js
│   ├── interaccionIA.model.js
│   ├── pedido.model.js
│   ├── producto.model.js
│   ├── resena.model.js
│   ├── usuario.model.js
│   ├── devolucion.model.js
│   └── vendedor.model.js
├── routes/
│   ├── ai.routes.js
│   ├── authRoutes.js
│   ├── pedidosRoutes.js
│   ├── productosRoutes.js
│   ├── resenasRoutes.js
│   ├── devolucionesRoutes.js
│   └── notificacionesRoutes.js
├── services/
│   ├── aiService.js
│   └── openaiClient.js

frontend/
├── components/
│   ├── IAResponseBox.tsx
│   ├── Layout.tsx
│   ├── PedidoCard.tsx
│   ├── PedidoForm.tsx
│   ├── ProductoCard.tsx
│   ├── ProductoForm.tsx
│   ├── ReseñasBox.tsx
│   └── SolicitarDevolucion.tsx
├── hooks/
│   └── useAuth.ts
├── pages/
│   ├── api/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── carrito.tsx
│   ├── dashboard-vendedor.tsx
│   ├── ia.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── mis-pedidos.tsx
│   └── Pedidos-Vendedor.tsx
├── public/
├── services/
├── styles/
├── tailwind.config.js
├── tsconfig.json
├── next.config.ts
├── next-env.d.ts
└── README.md
```

---

## ⚙️ Configuración Inicial

1. Instalar las dependencias:
   ```bash
   npm install
   ```

2. Crear un archivo `.env` con:
   ```env
   PORT=4000
   JWT_SECRET=tu_clave_secreta
   OPENAI_API_KEY=sk-xxx
   USE_OPENAI=true
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contrasena_app
   ADMIN_EMAIL=correo_destino@gmail.com
   EMAIL_FROM=Marketplace <tu_correo@gmail.com>
   ```

3. Iniciar el servidor:
   ```bash
   npm run dev
   ```

---

## 🔗 Endpoints Disponibles

### Productos
- `GET /api/productos`
- `POST /api/productos`
- `DELETE /api/productos/:id`

### Pedidos
- `GET /api/pedidos`
- `POST /api/pedidos`
- `GET /api/pedidos/usuario/:id`

### Usuarios
- `GET /api/usuarios`
- `POST /api/usuarios`

### Autenticación
- `POST /api/auth/login`
- `POST /api/auth/registro`

### Reseñas
- `GET /api/resenas/vendedor/:id`
- `POST /api/resenas`

### Devoluciones
- `GET /api/devoluciones`
- `POST /api/devoluciones`
- `PATCH /api/devoluciones/:id/aceptar`
- `PATCH /api/devoluciones/:id/rechazar`

### Inteligencia Artificial
- `POST /api/ia`
- `GET /api/ia/historial`

### Notificaciones
- `POST /api/notificaciones/correo`

---

## 🗂 Notas

- La base de datos se sincroniza automáticamente al iniciar el servidor.
- Para conservar datos, se recomienda `sequelize.sync({ alter: true })`.
- Si querés reiniciar todo, podés usar `sequelize.sync({ force: true })` (elimina y recrea las tablas).

---

## 📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Proyecto creado con fines educativos, con posibilidad de integrarse en aplicaciones móviles y futuras mejoras como notificaciones avanzadas y funciones de marketing.
