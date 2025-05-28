/**
 * @swagger
 * /api/mensajes/ping:
 *   get:
 *     summary: Verifica si el sistema de mensajes está activo
 *     tags: [Mensajes]
 *     responses:
 *       200:
 *         description: Sistema activo

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