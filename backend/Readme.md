# 📜 Guía rápida para probar reseñas y mensajes

## 1. Crear usuario comprador
```js
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('123456', 10);
await Usuario.create({
  nombreCompleto: 'Comprador Test',
  correo: 'comprador@correo.com',
  contraseña: hash,
  rol: 'comprador'
});
```

## 2. Crear usuario vendedor + perfil de vendedor
```js
const nuevoUsuario = await Usuario.create({
  nombreCompleto: 'Nuevo Vendedor',
  correo: 'nuevo@vendedor.com',
  contraseña: hash,
  rol: 'vendedor'
});
await Vendedor.create({ usuarioId: nuevoUsuario.id });
```

## 3. Crear producto asociado al vendedor
```js
await Producto.create({
  vendedorId: nuevoUsuario.id,
  nombre: 'Producto de prueba nuevo',
  descripcion: 'Descripción del nuevo producto',
  precio: 150,
  stock: 10,
  categoria: 'corte',
  activo: true,
  imagen: 'uploads/dpi/ejemplo.jpg',
  promedioCalificacion: 0
});
```

## 4. Crear pedido asociado al comprador
```js
await Pedido.create({
  compradorId: ID_DEL_COMPRADOR,
  total: 100,
  estado: 'pendiente',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 5. Generar token JWT para comprador
- Inicia sesión desde el frontend o endpoint de login
- Copia el token devuelto

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 6. Crear reseña con cURL
```bash
curl -X POST http://localhost:4000/api/resenas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendedorId": ID_VENDEDOR,
    "productoId": ID_PRODUCTO,
    "pedidoId": ID_PEDIDO,
    "comentario": "¡Excelente producto!",
    "calificacion": 5
  }'
```

---

## 7. Enviar mensaje al vendedor (nuevo módulo 💬)
```bash
curl -X POST http://localhost:4000/api/mensajes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receptorId": ID_VENDEDOR,
    "contenido": "¡Hola! ¿Tienes más productos disponibles?"
  }'
```

## 8. Ver historial de mensajes
```bash
curl http://localhost:4000/api/mensajes/ID_VENDEDOR \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Actualizar foto de perfil del vendedor
```bash
curl -X PATCH http://localhost:4000/api/usuarios/ID_VENDEDOR \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombreCompleto=Nuevo Nombre" \
  -F "correo=nuevo@correo.com" \
  -F "fotoPerfil=@/ruta/a/la/imagen.jpg"
```

---

## ✅ Requisitos clave para que funcione

- `vendedorId`, `productoId` deben **existir** y estar **relacionados**.
- `pedidoId` debe estar **asociado al comprador logueado**.
- No debe haber una reseña previa para ese `pedidoId`.
- El token JWT debe ser válido y de un usuario **rol: comprador**.
- Para mensajes, tanto `emisorId` como `receptorId` deben existir.