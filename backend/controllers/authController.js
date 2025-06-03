// 📁 backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
// const fs = require('fs'); // fs no se usa en el código que me diste, puedes quitarlo si no es necesario
const { Usuario, Vendedor } = require('../models');
const { OAuth2Client } = require('google-auth-library');

const secretKey = process.env.JWT_SECRET || 'clave_secreta_muy_segura_debe_cambiarse'; // Cambia 'clave_secreta' por algo más seguro o usa variables de entorno
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registrar = async (req, res) => {
  try {
    const {
      nombreCompleto, correo, contraseña, rol,
      telefono, direccion, municipio, departamento, nombreComercial
    } = req.body;

    console.log('[AuthController] Intentando registrar:', { correo, rol });

    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      console.warn('[AuthController] Registro fallido: Correo ya registrado -', correo);
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      nombreCompleto,
      correo,
      contraseña: hash, // Asegúrate de que el modelo Usuario usa 'contraseña' y no 'contrasena'
      rol,
      // El campo 'estado' se definirá con su valor por defecto ('activo') según el modelo Usuario
    });
    console.log('[AuthController] Nuevo usuario creado en DB:', nuevoUsuario.id, nuevoUsuario.correo);


    if (rol === 'vendedor') {
      console.log('[AuthController] Usuario es vendedor, procesando datos de vendedor...');
      const uploads = {};
      const campos = ['fotoDPIFrente', 'fotoDPIReverso', 'selfieConDPI', 'licenciaConducir'];

      for (const campo of campos) {
        if (req.files && req.files[campo]) {
          const archivo = req.files[campo][0];
          uploads[campo] = path.join('uploads/dpi', archivo.filename); // Ruta relativa
          console.log(`[AuthController] Archivo para ${campo}: ${uploads[campo]}`);
        } else {
          console.log(`[AuthController] No se encontró archivo para el campo ${campo}.`);
        }
      }

      await Vendedor.create({
        usuarioId: nuevoUsuario.id,
        nombreComercial: nombreComercial || nombreCompleto,
        telefono,
        direccion,
        municipio,
        departamento,
        ...uploads,
        // El campo 'estado' de Vendedor debería tener un valor por defecto en el modelo o asignarse aquí
      });
      console.log('[AuthController] Perfil de Vendedor creado para usuario ID:', nuevoUsuario.id);
    }

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', usuarioId: nuevoUsuario.id });
  } catch (error) {
    console.error('🛑 [AuthController] Error en registro:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar el usuario.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    console.log('[AuthController] Intento de login para:', correo);

    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      console.warn('[AuthController] Login fallido: Usuario no encontrado -', correo);
      return res.status(404).json({ mensaje: 'Usuario no encontrado o credenciales incorrectas.' });
    }

    // Verificar estado del usuario (si existe la columna 'estado')
    if (user.estado === 'bloqueado') {
        console.warn('[AuthController] Login fallido: Usuario bloqueado -', correo);
        return res.status(403).json({ mensaje: 'Esta cuenta ha sido bloqueada.' });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      console.warn('[AuthController] Login fallido: Contraseña incorrecta para -', correo);
      return res.status(401).json({ mensaje: 'Usuario no encontrado o credenciales incorrectas.' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '2h' });
    console.log('[AuthController] Login exitoso, token generado para usuario ID:', user.id);
    res.json({
      token,
      usuario: {
        id: user.id,
        nombreCompleto: user.nombreCompleto, // Asegúrate de usar nombreCompleto
        rol: user.rol,
        // No envíes la contraseña ni el hash
      },
    });
  } catch (error) {
    console.error('🛑 [AuthController] Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno al iniciar sesión.', error: error.message });
  }
};

exports.loginConGoogle = async (req, res) => {
  const { credential } = req.body;
  console.log('[AuthController] Intento de login con Google');

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;
    console.log('[AuthController] Payload de Google verificado para:', email);

    let user = await Usuario.findOne({ where: { correo: email } });

    if (!user) {
      console.log('[AuthController] Usuario de Google no encontrado, creando nuevo usuario:', email);
      user = await Usuario.create({
        nombreCompleto: name,
        correo: email,
        contraseña: await bcrypt.hash(`google_${Date.now()}_${email}`, 10), // Generar una contraseña aleatoria y segura
        rol: 'comprador', // Rol por defecto para usuarios de Google
        // estado: 'activo', // El modelo Usuario ya tiene 'activo' como defaultValue
        // metodoAutenticacion: 'google' // Si tienes este campo en tu modelo Usuario
      });
      console.log('[AuthController] Nuevo usuario creado vía Google:', user.id, user.correo);
    } else {
        if (user.estado === 'bloqueado') {
            console.warn('[AuthController] Login con Google fallido: Usuario bloqueado -', email);
            return res.status(403).json({ mensaje: 'Esta cuenta ha sido bloqueada.' });
        }
        console.log('[AuthController] Usuario encontrado vía Google:', user.id, user.correo);
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '2h' });
    console.log('[AuthController] Token generado para usuario de Google ID:', user.id);

    res.json({
      token,
      usuario: {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('🛑 [AuthController] Error al validar token de Google:', error);
    res.status(401).json({ mensaje: 'Token de Google inválido o error en el proceso.', error: error.message });
  }
};