/**
 * @swagger
 * /api/historial/{id}:
 *   get:
 *     summary: Obtener historial de actividades del usuario
 *     tags: [Historial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial del usuario obtenido correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Historial no encontrado
 */
