/**
 * @swagger
 * tags:
 *   - name: Entregas
 *     description: Endpoints para el control y confirmación de entregas
 */

/**
 * @swagger
 * /api/entregas/{pedidoId}:
 *   post:
 *     summary: Registrar nueva entrega para un pedido
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Entrega registrada correctamente
 *
 *   patch:
 *     summary: Actualizar detalles de la entrega
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *
 *   get:
 *     summary: Obtener entrega por ID de pedido
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la entrega
 */

/**
 * @swagger
 * /api/entregas/detalle/{id}:
 *   get:
 *     summary: Obtener detalle específico de entrega
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la entrega encontrado
 */

/**
 * @swagger
 * /api/entregas/{pedidoId}/confirmar:
 *   patch:
 *     summary: Confirmar entrega del pedido
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrega confirmada correctamente
 */