/**
 * @swagger
 * /api/ia:
 *   post:
 *     summary: Generar respuesta desde la IA
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta generada correctamente
 *
 * /api/ia/historial:
 *   get:
 *     summary: Obtener historial de interacciones con la IA
 *     tags: [IA]
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 */