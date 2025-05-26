/**
 * @swagger
 * tags:
 *   - name: Reseñas
 *     description: Endpoints relacionados con las reseñas de productos
 *   - name: Usuarios
 *     description: Endpoints para gestión de usuarios
 *   - name: Productos
 *     description: Endpoints para gestión de productos
 *   - name: Pedidos
 *     description: Endpoints para la gestión de pedidos
 *   - name: Mensajes
 *     description: Endpoints para la mensajería entre usuarios

// 👉 Sección resenas
/**
 * @swagger
 * /api/resenas:
 *   post:
 *     summary: Crear nueva reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResenaInput'
 *     responses:
 *       201:
 *         description: Reseña creada correctamente

 * /api/resenas/comprador/{id}:
 *   get:
 *     summary: Obtener reseñas de un comprador específico
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comprador
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/vendedor/{id}:
 *   get:
 *     summary: Obtener reseñas de un vendedor específico
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vendedor
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/producto/{id}:
 *   get:
 *     summary: Obtener reseñas de un producto
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de reseñas

 * /api/resenas/{id}:
 *   patch:
 *     summary: Editar una reseña (dentro de 24h)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResenaInput'
 *     responses:
 *       200:
 *         description: Reseña actualizada

 *   delete:
 *     summary: Eliminar una reseña (si no tiene respuesta)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña eliminada

 * /api/resenas/{id}/responder:
 *   patch:
 *     summary: Responder una reseña (vendedor)
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               respuestaVendedor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta guardada

 * /api/resenas/resumen/{id}:
 *   get:
 *     summary: Obtener resumen mensual de reseñas por vendedor
 *     tags: [Reseñas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del resumen mensual

// 👉 Sección Notificaciones
/**
 * @swagger
 * /api/notificaciones/correo:
 *   post:
 *     summary: Enviar una notificación por correo
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               para:
 *                 type: string
 *               asunto:
 *                 type: string
 *               mensaje:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 */

// 👉 Sección Vendedores
/**
 * @swagger
 * /api/vendedores/{id}:
 *   get:
 *     summary: Obtener perfil del vendedor autenticado
 *     tags: [Vendedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil del vendedor
 */

/**
 * @swagger
 * /api/vendedores/{id}/ranking:
 *   get:
 *     summary: Obtener ranking del vendedor
 *     tags: [Vendedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ranking del vendedor
 */

/**
 * @swagger
 * /api/vendedores/{id}/aprobar:
 *   patch:
 *     summary: Aprobar solicitud de vendedor (admin)
 *     tags: [Vendedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vendedor aprobado
 */

/**
 * @swagger
 * /api/vendedores/solicitud:
 *   post:
 *     summary: Enviar solicitud para convertirse en vendedor
 *     tags: [Vendedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoDPIFrente:
 *                 type: string
 *                 format: binary
 *               fotoDPIReverso:
 *                 type: string
 *                 format: binary
 *               selfieConDPI:
 *                 type: string
 *                 format: binary
 *               licenciaConducir:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Solicitud enviada correctamente
 */

// 👉 Sección Usuarios
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios del sistema
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Actualizar perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */

/**
 * @swagger
 * /api/usuarios/{id}/password:
 *   patch:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevaContrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */

/**
 * @swagger
 * /api/usuarios/debug/token:
 *   post:
 *     summary: Obtener token de prueba (debug)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Token generado
 */

// 👉 Sección Productos
/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear nuevo producto con imagen
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 */

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 *
 *   delete:
 *     summary: Eliminar un producto existente
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */

/**
 * @swagger
 * /api/productos/crear:
 *   post:
 *     summary: Crear un pedido desde la vista de productos
 *     tags: [Productos]
 *     responses:
 *       201:
 *         description: Pedido creado
 */

/**
 * @swagger
 * /api/productos/{id}/promedio-calificacion:
 *   get:
 *     summary: Obtener promedio de calificaciones del producto
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promedio de calificación
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos disponibles
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ResenaInput:
 *       type: object
 *       required:
 *         - comentario
 *         - calificacion
 *         - compradorId
 *         - productoId
 *       properties:
 *         comentario:
 *           type: string
 *         calificacion:
 *           type: integer
 *         compradorId:
 *           type: integer
 *         productoId:
 *           type: integer
 
// 👉 Sección pedidos
/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compradorId:
 *                 type: integer
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 *
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *
 *   put:
 *     summary: Cambiar el estado de un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 *
 * /api/pedidos/usuario/{id}:
 *   get:
 *     summary: Obtener pedidos de un usuario
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *
 * /api/pedidos/vendedor:
 *   get:
 *     summary: Obtener pedidos del vendedor autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del vendedor
 */

// 👉 Sección mensajes
/**
 * @swagger
 * /api/mensajes/ping:
 *   get:
 *     summary: Verifica si el sistema de mensajes está activo
 *     tags: [Mensajes]
 *     responses:
 *       200:
 *         description: Sistema activo
 *
 * @swagger
 * /api/mensajes:
 *   post:
 *     summary: Enviar un nuevo mensaje
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receptorId:
 *                 type: integer
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *
 * @swagger
 * /api/mensajes/{otroUsuarioId}:
 *   get:
 *     summary: Obtener mensajes con otro usuario
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otroUsuarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */ 

