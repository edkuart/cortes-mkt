// 📁 backend/models/pedido.model.js

module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('pedido', {
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente',
    },
  }, {
    tableName: 'pedidos',
    timestamps: true,
  });

  Pedido.associate = (models) => {
    Pedido.hasMany(models.DetallePedido, {
      foreignKey: 'pedidoId',
      as: 'detalles'
    });

    Pedido.hasOne(models.Entrega, {
      foreignKey: 'pedidoId'
    });

    Pedido.hasMany(models.Devolucion, {
      foreignKey: 'pedidoId'
    });

    Pedido.belongsTo(models.Usuario, {
      foreignKey: 'compradorId',
      as: 'comprador'
    });
  };

  return Pedido;
};




