const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  compradorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'enviado', 'entregado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'pedidos'
});

module.exports = Pedido;
