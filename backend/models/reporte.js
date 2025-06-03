//📁 backend/models/reporte.js

module.exports = (sequelize, DataTypes) => {
  const Reporte = sequelize.define('Reporte', {
    tipo: {
      type: DataTypes.ENUM('producto', 'reseña', 'mensaje'),
      allowNull: false,
    },
    contenidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'resuelto'),
      defaultValue: 'pendiente',
    }
  });

  Reporte.associate = models => {
    Reporte.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };

  return Reporte;
};
