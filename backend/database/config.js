// backend/database/config.js

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/marketplace.db",
});

module.exports = sequelize;
