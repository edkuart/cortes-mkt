// backend/models/pedido.model.js

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

  return Pedido;
};



