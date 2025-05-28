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
 */