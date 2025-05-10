// backend/models/resena.model.js

module.exports = (sequelize, DataTypes) => {
  const Resena = sequelize.define('resena', {
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'resenas',
    timestamps: true,
  });

  return Resena;
};


