// 📱 Proyecto Móvil - Marketplace Modular

## 🚀 Tecnologías Recomendadas

- React Native (Expo) o Flutter
- React Navigation / Flutter Navigator
- Context API o Redux para estado global
- Axios o Fetch para consumir la API backend
- Notificaciones push (opcional: Firebase)

## 📁 Estructura Sugerida

```
mobile/
├── App.js
├── package.json
├── assets/
├── components/
│   ├── ProductoCard.js
│   ├── PedidoCard.js
│   └── DevolucionModal.js
├── contexts/
│   └── AuthContext.js
├── screens/
│   ├── LoginScreen.js
│   ├── RegistroScreen.js
│   ├── DashboardVendedor.js
│   ├── MisPedidos.js
│   └── ProductoDetalle.js
├── navigation/
│   └── AppNavigator.js
├── services/
│   ├── api.js
│   └── authService.js
└── .env
```

## 🌐 Conexión al Backend
- URL base: `http://localhost:4000` (en desarrollo, usar IP local)
- .env:
```env
API_URL=http://192.168.1.100:4000
```

## 🧪 Funcionalidades Prioritarias

- [ ] Autenticación de usuarios (login/registro)
- [ ] Ver pedidos del usuario
- [ ] Confirmar entrega
- [ ] Solicitar devoluciones
- [ ] Dashboard vendedor
- [ ] Visualizar reseñas y productos
- [ ] Notificaciones push (futuro)

## ✅ Pruebas
- Testeo en emulador Android o dispositivo físico con la misma red Wi-Fi del backend

## 📬 Enlace con el backend
Usar endpoints como:
- `GET /api/pedidos/usuario/:id`
- `PATCH /api/entregas/:id/confirmar`
- `POST /api/devoluciones`

---

Este documento servirá como base para levantar tu app en la Play Store.
Podemos añadir secciones de estilo, iconos, splash screen, login social, etc. cuando querás.

# 📱 Móvil - Marketplace Modular

Este proyecto corresponde a la versión móvil del marketplace, diseñada para ser publicada en la **Google Play Store**. Se basa en **React Native con Expo** y está pensada para facilitar la experiencia de compra y gestión tanto para compradores como para vendedores.

---

## 🚀 Tecnologías Utilizadas

- React Native (con Expo)
- TypeScript
- React Navigation
- Axios (para peticiones al backend)
- Context API (para autenticación y estado global)
- AsyncStorage (almacenamiento local)

---

## 📁 Estructura del Proyecto

```
movil/
├── App.tsx
├── app.json
├── package.json
├── assets/
│   └── iconos, logos y otros recursos
├── components/
│   ├── BotonPrincipal.tsx
│   └── InputForm.tsx
├── context/
│   └── AuthContext.tsx
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegistroScreen.tsx
│   ├── DashboardVendedor.tsx
│   ├── MisPedidosScreen.tsx
│   └── ProductoDetalleScreen.tsx
├── services/
│   └── api.ts (configuración de Axios)
└── navigation/
    └── AppNavigator.tsx
```

---

## 🛠️ Funcionalidades por Pantalla

### LoginScreen.tsx ✅ (Primera a desarrollar)
- Autenticación contra `/api/auth/login`
- Guardar token con `AsyncStorage`
- Redireccionar a Dashboard según tipo de usuario

### RegistroScreen.tsx
- Formulario de registro de usuario `/api/auth/registro`

### DashboardVendedor.tsx
- Ver resumen de ventas
- Botón para enviar correo de prueba (como en frontend)

### MisPedidosScreen.tsx
- Lista de pedidos con estado
- Botón para confirmar entrega (cliente)

### ProductoDetalleScreen.tsx
- Información del producto y botón para solicitar devolución

---

## 📲 Plan de Trabajo

1. **Pantalla de Login** con integración de contexto de usuario (empezamos ahora).
2. Registro.
3. Dashboard del vendedor.
4. Pedidos del comprador.
5. Solicitud de devoluciones.
6. Exportar resumen a PDF (si se puede).
7. Preparar para publicación (íconos, splash, permisos).

---

¿Dudas? Escribí a [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Esta app está pensada para facilitar el comercio móvil de ropa típica guatemalteca, con posibilidad de incluir notificaciones y mejoras futuras.
