// 📁 backend/models/mensaje.model.js

module.exports = (sequelize, DataTypes) => {
    const Mensaje = sequelize.define('Mensaje', {
      emisorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receptorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      contenido: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'mensajes',
      timestamps: true
    });
  
    Mensaje.associate = (models) => {
      Mensaje.belongsTo(models.Usuario, { as: 'Emisor', foreignKey: 'emisorId' });
      Mensaje.belongsTo(models.Usuario, { as: 'Receptor', foreignKey: 'receptorId' });
    };
  
    return Mensaje;
  };
   