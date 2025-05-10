// backend/models/detallePedido.model.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('detalle_pedido', {
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'detalles_pedido',
    timestamps: true,
  });
};
