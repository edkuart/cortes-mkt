//📁 backend/controllers/reportesController.js

const { Reporte, Usuario } = require('../models');

const crearReporte = async (req, res) => {
  try {
    const { tipo, contenidoId, motivo, descripcion } = req.body;
    const nuevo = await Reporte.create({
      tipo,
      contenidoId,
      motivo,
      descripcion,
      usuarioId: req.usuario.id,
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("❌ Error al crear reporte:", error);
    res.status(500).json({ mensaje: 'Error al crear el reporte' });
  }
};

const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [{ model: Usuario, attributes: ['id', 'nombreCompleto', 'correo'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    res.status(500).json({ mensaje: 'Error al obtener los reportes' });
  }
};

const resolverReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);
    if (!reporte) return res.status(404).json({ mensaje: 'Reporte no encontrado' });

    reporte.estado = 'resuelto';
    await reporte.save();
    res.json(reporte);
  } catch (error) {
    console.error("❌ Error al resolver reporte:", error);
    res.status(500).json({ mensaje: 'Error al resolver el reporte' });
  }
};

module.exports = { crearReporte, obtenerReportes, resolverReporte };