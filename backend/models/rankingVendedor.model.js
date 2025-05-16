// 📁 models/rankingVendedor.model.js

module.exports = (sequelize, DataTypes) => {
    const RankingVendedor = sequelize.define('RankingVendedor', {
      vendedorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'vendedores', 
          key: 'usuarioId'
        }
      },
      promedioCalificacion: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      ventasTotales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      montoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'ranking_vendedores',
      timestamps: false
    });
  
    return RankingVendedor;
  };
  
  