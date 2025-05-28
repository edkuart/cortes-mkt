/**
 * @swagger
 * /api/vendedores/{id}:
 *   get:
 *     summary: Obtener perfil de un vendedor
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

 *   patch:
 *     summary: Aprobar solicitud de vendedor
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
 *         description: Solicitud enviada

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
 *         description: Datos de ranking del vendedor
 */