'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Devolucion extends Model {}

  Devolucion.init({
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendiente'
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Devolucion',
  });

  return Devolucion;
};