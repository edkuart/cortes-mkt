// 📁 models/favorito.model.js

module.exports = (sequelize, DataTypes) => {
  const Favorito = sequelize.define('Favorito', {
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Favorito;
};