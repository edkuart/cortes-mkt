// 📁 backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { Mensaje } = require('../models');
const { Op } = require('sequelize');
const verificarToken = require('../middleware/verificarToken');
const { obtenerConversaciones } = require('../controllers/mensajesController');

// ✅ Ruta protegida: obtener mensajes entre admin autenticado y otro usuario
router.get('/mensajes/:otroUsuarioId', verificarToken, async (req, res) => {
  const emisorId = req.usuario?.id;
  const receptorIdRaw = req.params.otroUsuarioId;
  const receptorId = parseInt(receptorIdRaw);

  console.log('🧪 Param recibido:', receptorIdRaw);
  console.log('👤 ID autenticado:', emisorId);

  if (!receptorIdRaw || isNaN(receptorId)) {
    return res.status(400).json({ mensaje: 'ID de receptor inválido (NaN)' });
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
    res.status(500).json({ mensaje: 'Error al obtener mensajes', error });
  }
});

// ✅ Ruta protegida: obtener lista de conversaciones activas
router.get('/mensajes/conversaciones', verificarToken, obtenerConversaciones);

const { Reporte, Usuario } = require('../models');

// GET todos los reportes
router.get('/reportes', verificarToken, async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(reportes);
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes' });
  }
});

// PATCH resolver un reporte
router.patch('/reportes/:id/resolver', verificarToken, async (req, res) => {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (!reporte) return res.status(404).json({ mensaje: 'Reporte no encontrado' });

    reporte.estado = 'resuelto';
    await reporte.save();

    res.json({ mensaje: 'Reporte resuelto', estado: reporte.estado });
  } catch (error) {
    console.error('❌ Error al resolver reporte:', error);
    res.status(500).json({ mensaje: 'Error al resolver reporte' });
  }
});

module.exports = router;
