# 🧵 Backend - Marketplace de Cortes y Ropa Típica

Este es el backend del proyecto **Marketplace Modular**, desarrollado con Node.js, Express y Sequelize usando SQLite como base de datos.

## 🚀 Tecnologías usadas

- Node.js + Express
- Sequelize ORM
- SQLite3
- JWT (para autenticación)
- Bcrypt.js (para contraseñas seguras)
- OpenAI (opcional, para módulo de IA)
- Dotenv (para variables de entorno)
- Nodemon (desarrollo)

---

## 📁 Estructura del proyecto

```
/backend
├── controllers/      # Lógica de negocio
├── routes/           # Endpoints REST
├── models/           # Modelos Sequelize
├── services/         # Servicios externos (ej. OpenAI)
├── database/         # Configuración de Sequelize
├── server.js         # Punto de entrada del servidor
├── .env              # Variables de entorno
└── package.json
```

---

## ⚙️ Configuración del entorno

1. Cloná el repositorio
2. Instalá dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con lo siguiente:

```env
PORT=4000
JWT_SECRET=tu_clave_supersecreta
USE_OPENAI=false
OPENAI_API_KEY=sk-xxx # (Solo si se activa OpenAI)
```

4. Ejecutá el servidor:

```bash
npm run dev
```

---

## 📡 Endpoints disponibles

### 🧍 Usuarios
- `POST /api/usuarios/registro`
- `POST /api/usuarios/login`

### 📦 Productos
- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`

### 📦 Pedidos
- `POST /api/pedidos`
- `GET /api/pedidos/usuario/:id`
- `PUT /api/pedidos/:id/estado`

### ⭐ Reseñas
- `POST /api/reseñas`
- `GET /api/reseñas/vendedor/:id`
- `GET /api/reseñas/vendedor/:id/promedio`

---

## 🤖 Inteligencia Artificial (opcional)

El módulo de IA usa OpenAI para generar recomendaciones. Está desactivado por defecto. Para activarlo:

1. Asegurate de tener una API Key válida
2. Cambiá `USE_OPENAI=true` en tu archivo `.env`

---

## 🛠️ Créditos y mantenimiento

Este proyecto fue desarrollado por eku-sama, y está en evolución activa.  
Contribuciones son bienvenidas.