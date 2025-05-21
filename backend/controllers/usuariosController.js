// 📁 backend/controllers/usuariosController.js

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'correo', 'rol', 'fotoPerfil']
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

const cambiarContrasena = async (req, res) => {
  const id = req.params.id;
  const { nuevaContrasena } = req.body;
  const usuarioAutenticado = req.usuario;

  if (!nuevaContrasena || nuevaContrasena.length < 6) {
    return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  if (parseInt(id) !== usuarioAutenticado.id) {
    return res.status(403).json({ mensaje: 'No autorizado para cambiar esta contraseña.' });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const hash = await bcrypt.hash(nuevaContrasena, 10);
    usuario.contraseña = hash;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const actualizarPerfil = async (req, res) => {
  const id = req.params.id;
  const { nombreCompleto, correo, nuevaContraseña } = req.body;
  const usuarioAutenticado = req.usuario;

  if (parseInt(id) !== usuarioAutenticado.id) {
    return res.status(403).json({ mensaje: 'No autorizado para editar este perfil.' });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.nombreCompleto = nombreCompleto;
    usuario.correo = correo;
    if (nuevaContraseña) {
      const hash = await bcrypt.hash(nuevaContraseña, 10);
      usuario.contraseña = hash;
    }

    if (req.files && req.files.fotoPerfil) {
      const archivo = req.files.fotoPerfil[0];
      const extensionesPermitidas = ['.jpg', '.jpeg', '.png'];
      const extension = path.extname(archivo.originalname).toLowerCase();
      const tamañoMaximo = 2 * 1024 * 1024;

      if (!extensionesPermitidas.includes(extension)) {
        return res.status(400).json({ mensaje: 'Formato de imagen no permitido. Usa JPG o PNG.' });
      }

      if (archivo.size > tamañoMaximo) {
        return res.status(400).json({ mensaje: 'La imagen excede el tamaño máximo de 2MB.' });
      }

      const nuevaRuta = path.join('uploads/perfiles', archivo.filename);
      if (usuario.fotoPerfil) {
        const rutaAnterior = path.join(__dirname, '..', usuario.fotoPerfil);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }

      usuario.fotoPerfil = nuevaRuta;
    }

    if (req.body.borrarFoto === 'true' && usuario.fotoPerfil) {
      const rutaFoto = path.join(__dirname, '..', usuario.fotoPerfil);
      if (fs.existsSync(rutaFoto)) fs.unlinkSync(rutaFoto);
      usuario.fotoPerfil = null;
    }

    const fotoUrl = usuario.fotoPerfil ? `${req.protocol}://${req.get('host')}/${usuario.fotoPerfil.replace(/\\/g, '/')}` : null;
    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        ...usuario.toJSON(),
        fotoUrl
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const mostrarToken = (token) => {
  console.log('🔐 Token JWT generado:', token);
};

const loginDebug = async (req, res) => {
  const token = req.body.token || 'TOKEN_NO_PROPORCIONADO';
  mostrarToken(token);
  res.json({ mensaje: 'Token mostrado en consola' });
};

module.exports = {
  actualizarPerfil,
  mostrarToken,
  loginDebug,
  obtenerUsuarios,
  cambiarContrasena
};