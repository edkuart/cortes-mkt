// 📁 backend/controllers/vendedoresController.js

const { vendedor, RankingVendedor } = require('../models');

exports.solicitarVendedor = async (req, res) => {
    try {
      const { usuarioId, nombreComercial } = req.body;
      const files = req.files;

      const nuevo = await vendedor.create({
        usuarioId,
        nombreComercial,
        fotoDPIFrente: files?.fotoDPIFrente?.[0]?.path,
        fotoDPIReverso: files?.fotoDPIReverso?.[0]?.path,
        selfieConDPI: files?.selfieConDPI?.[0]?.path,
        licenciaConducir: files?.licenciaConducir?.[0]?.path,
      });

      res.status(201).json({ mensaje: 'Solicitud enviada', data: nuevo });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al registrar vendedor', error: err });
    }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const vendedorPerfil = await vendedor.findByPk(req.params.id);
    if (!vendedorPerfil) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

    res.json(vendedorPerfil);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: err });
  }
};

exports.aprobarVendedor = async (req, res) => {
  try {
    const vendedorData = await vendedor.findByPk(req.params.id);
    if (!vendedorData) return res.status(404).json({ mensaje: 'No existe la solicitud' });

    vendedorData.estado = 'aprobado';
    await vendedorData.save();

    res.json({ mensaje: 'Cuenta de vendedor aprobada' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al aprobar vendedor', error: err });
  }
};

exports.obtenerRankingVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const ranking = await RankingVendedor.findOne({ where: { vendedorId: id } });

    if (!ranking) {
      return res.status(404).json({ mensaje: 'Ranking no encontrado para este vendedor' });
    }

    res.json(ranking);
  } catch (error) {
    console.error('Error al obtener ranking del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al obtener ranking' });
  }
};