// backend/models/producto.model.js
module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('producto', {
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendedores',
        key: 'usuarioId'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.TEXT,
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'productos',
    timestamps: true
  });

  Producto.associate = (models) => {
    Producto.hasMany(models.Resena, {
      foreignKey: 'productoId',
      as: 'resenas'
    });

    Producto.belongsTo(models.Vendedor, {
      foreignKey: 'vendedorId',
      as: 'vendedor'
    });
  };

  return Producto;
};




