# Documentación del proyecto

cortes-mkt/
├── backend/
│   ├── app/
│   │   └── instance
│   │       └── app.py                 # (opcional) API auxiliar con Flask
│   ├── config/
│   │   ├── db.js                      # Configuración de la base de datos
│   │   └── iaGateway.js               # 🔌 API Gateway para servicios de IA externos
│   ├── controllers/
│   │   ├── aiController.js            # Controlador para IA
│   │   ├── productosController.js     # Controlador de productos
│   │   └── authController.js          # Nuevo
│   ├── instance/
│   │   └── marketplace.db             # SQLite base de datos
│   ├── middlewares/
│   │   ├── authMiddleware.js          # Middleware de autenticación
│   │   └── errorHandler.js            # Nuevo
│   ├── models/
│   │   ├── interaccionIA.js
│   │   ├── Producto.js                # Modelo de producto
│   │   └── User.js   
│   ├── node_modules/                  # Nuevo
│   ├── routes/
│   │   ├── ai.routes.js               # Ruta para IA
│   │   ├── productosRoutes.js         # Rutas de productos
│   │   └── auth.routes.js             # Nuevo
│   ├── services/
│   │   ├── aiService.js               # Servicio IA (OpenAI, HuggingFace, etc)
│   │   ├── productoService.js         # Lógica de negocio de productos
│   │   └── userService.js             # Nuevo
│   ├── venv/                          # Virtualenv para backend Flask
│   ├── .env 
│   ├── server.js                      # Punto de entrada del backend
│   ├── testOpenAI.js
│   ├── database.sqlite
│   ├── package-lock.json 
│   └── package.json
│
│   frontend/
│   ├── .next/
│   ├── components/
│   │   ├── Layout.tsx                 # Diseño general
│   │   ├── ProductoCard.tsx           # Componente visual de productos
│   │   ├── ProductoForm.tsx           
│   │   └── IAResponseBox.tsx          # Componente para respuestas IA
│   ├── hooks/
│   │   └── useIA.ts                   # Hook para interactuar con IA
│   ├── .node_modules/
│   ├── pages/
│   │   ├── index.js 
│   │   ├── index.tsx                  # Página principal (listar/agregar   productos)
│   │   ├── ia.js 
│   │   ├── ia.tsx                     # Página de chat o herramientas IA
│   │   ├── login.tsx                  # (Futuro) Página de inicio de sesión
│   │   └── api/
│   │       └── hello.ts 
│   ├── public/                        # Imágenes y logos
│   ├── services/
│   │   └── apiClient.ts               # Cliente fetch para backend
│   ├── styles/
│   │   └── globals.css                # Tailwind y estilos base
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   └── next.config.ts
│
│   README.md
│   .gitignore



