// backend/controllers/entregasController.js

const { Entrega, Pedido, Usuario } = require('../models');

exports.registrarEntrega = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { codigoGuia, fechaEnvio } = req.body;

    const nueva = await Entrega.create({ pedidoId, codigoGuia, fechaEnvio });
    res.status(201).json({ mensaje: 'Entrega registrada', entrega: nueva });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar entrega', error: err.message });
  }
};

exports.actualizarEntrega = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const entrega = await Entrega.findByPk(pedidoId);
    if (!entrega) return res.status(404).json({ mensaje: 'Entrega no encontrada' });

    await entrega.update(req.body);
    res.json({ mensaje: 'Entrega actualizada', entrega });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar entrega', error: err.message });
  }
};

exports.obtenerEntrega = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const entrega = await Entrega.findByPk(pedidoId);
    if (!entrega) return res.status(404).json({ mensaje: 'Entrega no encontrada' });

    res.json(entrega);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al consultar entrega', error: err.message });
  }
};

exports.obtenerDetalleEntrega = async (req, res) => {
  try {
    const entrega = await Entrega.findOne({
      where: { pedidoId: req.params.id },
      include: [{
        model: Pedido,
        include: [{
          model: Usuario,
          as: 'Comprador',
          attributes: ['id', 'nombreCompleto', 'correo']
        }]
      }]
    });

    if (!entrega) {
      return res.status(404).json({ mensaje: 'Entrega no encontrada' });
    }

    res.json(entrega);
  } catch (err) {
    console.error('Error al obtener detalle de entrega:', err);
    res.status(500).json({ mensaje: 'Error al obtener detalle de entrega' });
  }
};

exports.confirmarEntrega = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { tipo } = req.body;

    const entrega = await Entrega.findByPk(pedidoId);
    if (!entrega) {
      return res.status(404).json({ mensaje: 'Entrega no encontrada' });
    }

    if (tipo === 'cliente') {
      entrega.confirmacionCliente = true;
    } else if (tipo === 'repartidor') {
      entrega.confirmacionRepartidor = true;
    } else {
      return res.status(400).json({ mensaje: 'Tipo de confirmación inválido' });
    }

    await entrega.save();

    res.json({ mensaje: 'Confirmación registrada', entrega });
  } catch (err) {
    console.error('Error al confirmar entrega:', err);
    res.status(500).json({ mensaje: 'Error al confirmar entrega' });
  }
};
