// 📄 backend/config/db.js

const { Sequelize } = require('sequelize');

// ⚠️ Puedes ajustar el path si quieres usar otra carpeta para la base

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // o cambia la ruta si deseas
});

module.exports = sequelize;

