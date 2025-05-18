# 📝 Guía rápida para crear una reseña funcional (con datos válidos)

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
Usar el token resultante del login para autenticar.

## 6. Crear reseña con cURL
```bash
curl -X POST http://localhost:4000/api/resenas \
  -H "Authorization: Bearer TU_TOKEN" \
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

## ✅ Requisitos clave para que funcione

- `vendedorId` y `productoId` deben **existir** y estar relacionados.
- `pedidoId` debe existir y estar **asociado al comprador logueado**.
- El comprador **no debe haber dejado una reseña previa** para ese `pedidoId`.
- El token JWT debe ser válido y pertenecer a un **comprador**.
