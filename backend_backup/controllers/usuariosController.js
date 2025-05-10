const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
  try {
    const { nombreCompleto, correo, contrasena, telefono, tipoUsuario } = req.body;
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const hash = await bcrypt.hash(contrasena, 10);
    const nuevo = await Usuario.create({
      nombreCompleto, correo, contrasena: hash, telefono, tipoUsuario
    });

    res.status(201).json({ mensaje: 'Usuario creado con éxito', id: nuevo.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipoUsuario }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario
};
