//backend/models/entrega.model.js

module.exports = (sequelize, DataTypes) => {
    const Entrega = sequelize.define('entrega', {
      pedidoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'pedidos',
          key: 'id',
        },
      },
      codigoGuia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaEnvio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fechaEntrega: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      confirmacionCliente: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      confirmacionRepartidor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      tableName: 'entregas',
      timestamps: true,
    });
  
    return Entrega;
  };
  