// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usuario } = require('../models');

const secretKey = process.env.JWT_SECRET || 'clave_secreta';

const password = '123456';

bcrypt.hash(password, 10, function(err, hash) {
  if (err) return console.error('Error al hashear:', err);
  console.log('Hash generado:', hash);
});

exports.registrar = async (req, res) => {
  try {
    const { nombreCompleto, correo, contraseña } = req.body;

    const usuarioExistente = await usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await usuario.create({
      nombreCompleto,
      correo,
      contraseña: hash
    });

    res.status(201).json({ mensaje: 'Usuario creado exitosamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar.', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const user = await usuario.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '2h' });
    res.json({ token, usuario: { id: user.id, nombre: user.nombreCompleto, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error });
  }
};
