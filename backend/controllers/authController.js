// 📁 controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { Usuario, Vendedor } = require('../models');
const { OAuth2Client } = require('google-auth-library');

const secretKey = process.env.JWT_SECRET || 'clave_secreta';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registrar = async (req, res) => {
  try {
    const {
      nombreCompleto, correo, contraseña, rol,
      telefono, direccion, municipio, departamento, nombreComercial
    } = req.body;    

    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({ nombreCompleto, correo, contraseña: hash, rol });

    if (rol === 'vendedor') {
      const uploads = {};
      const campos = ['fotoDPIFrente', 'fotoDPIReverso', 'selfieConDPI', 'licenciaConducir'];

      for (const campo of campos) {
        if (req.files && req.files[campo]) {
          const archivo = req.files[campo][0];
          uploads[campo] = path.join('uploads/dpi', archivo.filename);
        }
      }

      await Vendedor.create({
        usuarioId: nuevoUsuario.id,
        nombreComercial: nombreComercial || nombreCompleto, // opcional
        telefono,
        direccion,
        municipio,
        departamento,
        ...uploads,
      });
    }

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('🛑 Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar.', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '2h' });
    res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombreCompleto,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('🛑 Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error });
  }
};

exports.loginConGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await Usuario.findOne({ where: { correo: email } });

    if (!user) {
      user = await Usuario.create({
        nombreCompleto: name,
        correo: email,
        contraseña: 'google-auth',
        rol: 'comprador',
        metodoAutenticacion: 'google'
      });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '2h' });

    res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombreCompleto,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('🛑 Error al validar token de Google:', error);
    res.status(401).json({ mensaje: 'Token de Google inválido' });
  }
};

