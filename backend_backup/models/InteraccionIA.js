// 📁 models/InteraccionIA.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InteraccionIA = sequelize.define('InteraccionIA', {
  prompt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = InteraccionIA;




