const { Devolucion, Pedido, DetallePedido, Producto } = require('../models');

const obtenerDevoluciones = async (req, res) => {
  try {
    const devoluciones = await Devolucion.findAll({
      where: { estado: 'pendiente' },
      include: {
        model: Pedido,
        include: [
          {
            model: DetallePedido,
            as: 'detalles',
            include: [Producto],
          }
        ]
      }
    });

    // Opcional: mapear para frontend
    const respuesta = devoluciones.map(dev => ({
      id: dev.id,
      motivo: dev.motivo,
      createdAt: dev.createdAt,
      producto: dev.Pedido.detalles[0]?.producto || null,
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener devoluciones' });
  }
};

const aceptarDevolucion = async (req, res) => {
  try {
    const devolucion = await Devolucion.findByPk(req.params.id);
    if (!devolucion) return res.status(404).json({ mensaje: 'Devolución no encontrada' });

    devolucion.estado = 'aceptada';
    await devolucion.save();

    res.json({ mensaje: 'Devolución aceptada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al aceptar devolución' });
  }
};

const rechazarDevolucion = async (req, res) => {
  try {
    const devolucion = await Devolucion.findByPk(req.params.id);
    if (!devolucion) return res.status(404).json({ mensaje: 'Devolución no encontrada' });

    devolucion.estado = 'rechazada';
    await devolucion.save();

    res.json({ mensaje: 'Devolución rechazada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al rechazar devolución' });
  }
};

const crearDevolucion = async (req, res) => {
    try {
      const { motivo, pedidoId } = req.body;
  
      if (!motivo || !pedidoId) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
      }
  
      const nueva = await Devolucion.create({
        motivo,
        pedidoId,
        estado: 'pendiente',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar la devolución' });
    }
  };  

module.exports = {
  obtenerDevoluciones,
  aceptarDevolucion,
  rechazarDevolucion,
  crearDevolucion,
};

  