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

const actualizarPerfil = async (req, res) => {
  const id = req.params.id;
  const { nombreCompleto, correo, nuevaContraseña } = req.body;
  const usuarioAutenticado = req.usuario; // viene del middleware con token

  if (parseInt(id) !== usuarioAutenticado.id) {
    return res.status(403).json({ mensaje: 'No autorizado para editar este perfil.' });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Actualizar campos
    usuario.nombreCompleto = nombreCompleto;
    usuario.correo = correo;
    if (nuevaContraseña) {
      const hash = await bcrypt.hash(nuevaContraseña, 10);
      usuario.contraseña = hash;
    }

    // Manejo de imagen de perfil
    if (req.files && req.files.fotoPerfil) {
      const nuevaRuta = path.join('uploads/perfiles', req.files.fotoPerfil[0].filename);

      // Eliminar la antigua si existe
      if (usuario.fotoPerfil) {
        const rutaAnterior = path.join(__dirname, '..', usuario.fotoPerfil);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }

      usuario.fotoPerfil = nuevaRuta;
    }

    // Si se solicita eliminar
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

// 🧪 DEBUG: Mostrar token generado en login o loginConGoogle
const mostrarToken = (token) => {
  console.log('🔐 Token JWT generado:', token);
};

// ✅ Función para devolver token en pruebas desde login
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
};