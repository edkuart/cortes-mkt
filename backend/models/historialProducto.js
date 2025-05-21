// 📁 models/historialProducto.js

module.exports = (sequelize, DataTypes) => {
  const HistorialProducto = sequelize.define('HistorialProducto', {
    productoId: DataTypes.INTEGER,
    campo: DataTypes.STRING,
    valorAnterior: DataTypes.STRING,
    valorNuevo: DataTypes.STRING,
    imagenAnterior: DataTypes.STRING,
    imagenNueva: DataTypes.STRING,
    usuarioNombre: DataTypes.STRING,
  }, {
    timestamps: true,
  });

  HistorialProducto.associate = (models) => {
    HistorialProducto.belongsTo(models.Producto, { foreignKey: 'productoId' });
  };

  return HistorialProducto;
};