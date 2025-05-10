const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombreCompleto,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = { login };
