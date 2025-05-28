# 📱 Marketplace Modular - App Móvil

Esta es la aplicación **móvil oficial** del proyecto Marketplace Modular. Está construida con **React Native + Expo**, y conecta directamente con el backend del marketplace. Permite iniciar sesión, ver pedidos, gestionar devoluciones y más funcionalidades para compradores y vendedores.

---

## 🚀 Tecnologías Utilizadas

- React Native (Expo)
- React Navigation
- AsyncStorage
- Day.js (fechas)
- Context API (autenticación)
- Fetch + manejo de token JWT

---

## 📁 Estructura del Proyecto

```
mobile/
├── App.js
├── app.json
├── package.json
├── .env
├── components/
├── contexts/
│   └── AuthContext.js
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── LoginScreen.js
│   ├── RegistroScreen.js
│   ├── DashboardVendedor.js
│   ├── MisPedidos.js
│   ├── DevolucionesScreen.js
│   ├── DetallePedidoScreen.js
│   └── ResenasScreen.js
├── services/
│   └── api.js
└── assets/
```
🛡 En producción, usá HTTPS y un dominio real para el API_URL.
---

## ⚙️ Configuración Inicial

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env`:

```env
API_URL=http://192.168.1.100:4000

```

> ⚠️ Reemplazá la IP por la IP de tu servidor si estás en red local.

3. Iniciar la app:

```bash
npx expo start --clear
```

4. Escaneá el QR con Expo Go desde tu celular.

---

## ✅ Funcionalidades Actuales

- Autenticación con JWT
- Restauración de sesión desde AsyncStorage
- Redirección automática al dashboard según el rol
- Vista de pedidos del comprador y vendedor, protegida con token JWT
- Vista de devoluciones con botones para aceptar/rechazar
- Vista de detalle del pedido con productos, totales y estado
- Vista de reseñas con nombre del cliente, comentario, calificación y fecha
- Logout y limpieza de sesión

---

## 🔐 API protegida

Las peticiones autenticadas (por ejemplo `/api/pedidos/vendedor`, `/api/devoluciones`, `/api/resenas/vendedor/:id`) usan automáticamente el token JWT almacenado en el dispositivo.

---

## ⬆️ Próximas Funciones (sugeridas)

- Menú lateral con navegación entre módulos
- Exportación PDF (resumen del mes)
- Notificaciones push con Firebase
- Perfil de usuario editable

---

## 📝 Commit Sugerido

```bash
git add mobile/
git commit -m "⭐ Pantalla de reseñas del vendedor integrada con navegación y consumo de API"
```

---

## 📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)


