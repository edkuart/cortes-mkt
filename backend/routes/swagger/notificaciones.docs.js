/**
 * @swagger
 * /api/notificaciones/correo:
 *   post:
 *     summary: Enviar correo de notificación
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destino:
 *                 type: string
 *               asunto:
 *                 type: string
 *               mensaje:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 */
