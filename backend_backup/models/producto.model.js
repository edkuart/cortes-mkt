const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING, // Podés usar URL por ahora, más adelante se puede hacer upload real
    allowNull: true,
  },
}, {
  tableName: 'productos',
});

module.exports = Producto;
