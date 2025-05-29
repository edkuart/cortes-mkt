// 📁 backend/models/reporte.js
module.exports = (sequelize, DataTypes) => {
  const Reporte = sequelize.define('Reporte', {
    tipo: {
      type: DataTypes.STRING, // Ej: 'reseña', 'producto'
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
    estado: {
      type: DataTypes.ENUM('pendiente', 'resuelto'),
      defaultValue: 'pendiente',
    },
    reportadoPor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Reporte;
};
