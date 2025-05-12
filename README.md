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
