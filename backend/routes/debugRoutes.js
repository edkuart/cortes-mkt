// 📁 backend/routes/debugRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario, Mensaje } = require('../models');

// ✅ Ruta para crear el usuario admin
router.get('/crear-admin', async (req, res) => {
  try {
    const existente = await Usuario.findOne({ where: { correo: 'admin@cortes.gt' } });

    if (existente) {
      return res.status(200).json({ mensaje: '⚠️ El usuario admin ya existe', usuario: existente });
    }

    const hash = await bcrypt.hash('123456', 10);

    const nuevoAdmin = await Usuario.create({
      nombreCompleto: 'Admin Root',
      correo: 'admin@cortes.gt',
      contraseña: hash,
      rol: 'admin',
      estado: 'activo'
    });

    res.status(201).json({ mensaje: '✅ Usuario admin creado', usuario: nuevoAdmin });

  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario admin', error });
  }
});

// ✅ Ruta para obtener todos los usuarios (para Dashboard Admin)
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'correo', 'rol', 'estado'],
      order: [['createdAt', 'DESC']],
    });
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// ✅ Ruta para verificar el funcionamiento de mensajes
router.get('/ping-mensajes', (req, res) => {
  res.send('📨 Endpoint de mensajes operativo');
});

// ✅ Ruta de prueba para obtener mensajes entre usuarios con validación
router.get('/mensajes/:otroUsuarioId', async (req, res) => {
  const emisorId = 1; // Simulación de ID autenticado
  const receptorId = parseInt(req.params.otroUsuarioId);

  if (isNaN(receptorId)) {
    return res.status(400).json({ mensaje: 'ID de receptor inválido' });
  }

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { emisorId, receptorId },
          { emisorId: receptorId, receptorId: emisorId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
});

module.exports = router;
