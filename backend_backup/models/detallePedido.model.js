const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetallePedido = sequelize.define('DetallePedido', {
  pedidoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'detalles_pedido'
});

module.exports = DetallePedido;
