const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reseña = sequelize.define('Reseña', {
  vendedorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  compradorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'reseñas'
});

module.exports = Reseña;
