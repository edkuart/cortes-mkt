// 📁 backend/models/resena.model.js

module.exports = (sequelize, DataTypes) => {
  const Resena = sequelize.define('resena', {
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'resenas',
    timestamps: true
  });

  Resena.associate = (models) => {
    Resena.belongsTo(models.Usuario, {
      foreignKey: 'compradorId',
      as: 'Comprador'
    });

    Resena.belongsTo(models.Usuario, {
      foreignKey: 'vendedorId',
      as: 'Vendedor'
    });

    Resena.belongsTo(models.Producto, {
      foreignKey: 'productoId',
      as: 'Producto'
    });
  };

  return Resena;
};

