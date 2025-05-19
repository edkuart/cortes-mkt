// backend/models/vendedor.model.js
module.exports = (sequelize, DataTypes) => {
    const vendedor = sequelize.define('vendedor', {
      usuarioId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      nombreComercial: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      municipio: {
        type: DataTypes.STRING,
        allowNull: false
      },
      departamento: {
        type: DataTypes.STRING,
        allowNull: false
      },
      
      fotoDPIFrente: DataTypes.STRING,
      fotoDPIReverso: DataTypes.STRING,
      selfieConDPI: DataTypes.STRING,
      licenciaConducir: DataTypes.STRING,
      ventasTotales: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      montoTotalQ: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: 'pendiente' // pendiente, aprobado, rechazado
      }
    }, {
      tableName: 'vendedores',
      timestamps: true
    });
  
    return vendedor;
  };
  