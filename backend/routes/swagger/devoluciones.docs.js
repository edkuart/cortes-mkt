/**
 * @swagger
 * /api/devoluciones:
 *   get:
 *     summary: Obtener todas las devoluciones (solo para vendedores)
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de devoluciones obtenida correctamente
 *
 *   post:
 *     summary: Crear solicitud de devolución (solo para compradores)
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: integer
 *               motivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Devolución creada correctamente
 *
 * /api/devoluciones/{id}/aceptar:
 *   patch:
 *     summary: Aceptar una solicitud de devolución
 *     tags: [Devoluciones]
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
 *         description: Devolución aceptada

 * /api/devoluciones/{id}/rechazar:
 *   patch:
 *     summary: Rechazar una solicitud de devolución
 *     tags: [Devoluciones]
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
 *         description: Devolución rechazada
 */