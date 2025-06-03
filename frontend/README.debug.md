# 🐛 Problema en `/admin/dashboard` - Ciclo infinito

## ✅ Contexto del proyecto

Este dashboard es parte del frontend del proyecto **Marketplace Modular**, construido con Next.js, React y TailwindCSS. Se utiliza un sistema de autenticación JWT con `localStorage` para mantener el token del usuario. El componente `DashboardAdmin` carga información estadística y de usuarios desde el backend.

## ❗ Descripción del problema

Al acceder a la ruta `/admin/dashboard`, se produce un **loop infinito de renderizados** o de llamadas a la API.

### Evidencia:

* En el frontend, el mensaje `Cargando usuarios...` permanece indefinidamente.
* En consola del backend aparecen logs repetitivos del token recibido, decodificación y verificación del rol.

### Logs observados (repetidos muchas veces por segundo):

```
✅ Token decodificado: { id: 2, rol: 'admin', ... }
🧪 Param recibido: conversaciones
👤 Usuario autenticado: 2
```

## 🔍 Sospechas

1. **`useEffect` depende de `isAuthenticated()` como función**:

   * Podría estar cambiando de referencia en cada render.

2. **`localStorage.removeItem('token')` en `fetchTodosLosUsuarios()`**:

   * Si el token se remueve por un 401 temporal, puede provocar una reautenticación constante.

3. **`user` se inicializa como `null` y luego se setea**, disparando el efecto de nuevo.

4. **El layout o `RutaProtegida` podría estar haciendo rechecks al contexto, forzando renders.**

---

## 🧠 Comportamiento esperado

* Si el token es válido y el usuario tiene rol `admin`, el dashboard debe cargar únicamente **una vez**.
* Si el token expira o es inválido, redirigir al login sin quedar en un ciclo.

---

## 🛠 Sugerencias para depuración

1. Agregar logs a `useEffect` para ver qué está disparando los cambios:

```ts
useEffect(() => {
  console.log('Debug useEffect:', { auth: isAuthenticated(), rol: user?.rol, token });
  fetchEstadisticas();
  fetchTodosLosUsuarios();
}, [isAuthenticated, user, token]);
```

2. Verificar si `isAuthenticated` está memoizado (por ejemplo, con `useCallback` o proveniente de un contexto que no cambia).

3. Usar `console.trace()` dentro del efecto para ver desde dónde se dispara el render.

---

## 📤 Prompt para herramientas como Codex o GitHub Copilot

> Tengo un componente de dashboard de administrador en Next.js que entra en un loop infinito de renderizados o llamadas a fetch(). Uso `useEffect` con dependencias \[isAuthenticated, user, token]. Sospecho que isAuthenticated() cambia de referencia o que el token se remueve en un fetch fallido.

> 🚫 Necesito ayuda para evitar que se dispare más de una vez si ya estoy autenticado como admin. ¿Cómo lo aíslo mejor?
