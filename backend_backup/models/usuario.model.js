const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipoUsuario: {
    type: DataTypes.ENUM('comprador', 'vendedor', 'admin'),
    defaultValue: 'comprador'
  }
}, {
  tableName: 'usuarios'
});

module.exports = Usuario;
