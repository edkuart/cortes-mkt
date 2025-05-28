/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar nuevo usuario con documentos
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
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
 *         description: Usuario registrado correctamente

 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con correo y contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso

 * /api/auth/google-login:
 *   post:
 *     summary: Iniciar sesión con cuenta de Google
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión con Google exitoso
 */
