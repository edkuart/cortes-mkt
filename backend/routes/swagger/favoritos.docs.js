// 📁 routes/swagger/favoritos.docs.js

/**
 * @swagger
 * tags:
 *   - name: Favoritos
 *     description: Endpoints para gestionar productos favoritos del comprador
 */

/**
 * @swagger
 * /api/favoritos/{usuarioId}:
 *   get:
 *     tags: [Favoritos]
 *     summary: Obtener productos favoritos de un usuario
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de productos favoritos
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /api/favoritos:
 *   post:
 *     tags: [Favoritos]
 *     summary: Agregar un producto a favoritos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               productoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto agregado a favoritos
 *       200:
 *         description: Ya estaba en favoritos
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /api/favoritos/{usuarioId}/{productoId}:
 *   delete:
 *     tags: [Favoritos]
 *     summary: Eliminar un producto de favoritos
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado exitosamente
 *       500:
 *         description: Error en el servidor
 */
