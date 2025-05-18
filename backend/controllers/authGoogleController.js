// 📁 controllers/authGoogleController.js
const { OAuth2Client } = require('google-auth-library');
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secretKey = process.env.JWT_SECRET || 'clave_secreta';

exports.loginConGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let usuario = await Usuario.findOne({ where: { correo: email } });

    if (!usuario) {
      usuario = await Usuario.create({
        nombreCompleto: name,
        correo: email,
        contraseña: 'GOOGLE_AUTH', // Marcarlo como usuario de Google
        rol: 'comprador',
      });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, secretKey, { expiresIn: '2h' });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombreCompleto,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error('❌ Error en login con Google:', error);
    res.status(401).json({ mensaje: 'Error al verificar el token de Google' });
  }
};