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
│   └── DetallePedidoScreen.js
├── services/
│   └── api.js
└── assets/
```

---

## ⚙️ Configuración Inicial

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env`:

```env
API_URL=http://192.168.1.173:4000
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
- Vista de pedidos del vendedor (token protegido)
- Vista de devoluciones con botones para aceptar/rechazar
- Vista de detalle del pedido con productos, totales y estado
- Logout y limpieza de sesión

---

## 🔐 API protegida

Las peticiones autenticadas (por ejemplo `/api/pedidos/vendedor`, `/api/devoluciones`) usan automáticamente el token JWT almacenado en el dispositivo.

---

## ⬆️ Próximas Funciones (sugeridas)

- Menú lateral con navegación entre módulos
- Reseñas del vendedor
- Exportación PDF (resumen del mes)
- Notificaciones push con Firebase

---

## 📝 Commit Sugerido

```bash
git add mobile/
git commit -m "🧾 Detalle de pedido móvil con navegación desde el dashboard"
```

---

## 📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)

