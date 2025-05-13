// 📁 backend/models/resena.model.js

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
    pedidoId: {
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
      validate: {
        min: 1,
        max: 5
      }
    },
  }, {
    tableName: 'resenas',
    timestamps: true,
  });

  Resena.associate = (models) => {
    Resena.belongsTo(models.Usuario, { foreignKey: 'compradorId', as: 'Comprador' });
    Resena.belongsTo(models.Usuario, { foreignKey: 'vendedorId', as: 'Vendedor' });
    Resena.belongsTo(models.Pedido, { foreignKey: 'pedidoId', as: 'Pedido' });
  };

  return Resena;
};


