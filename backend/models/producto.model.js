// 📁 backend/models/producto.model.js (actualizado sin promedioCalificacion)

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
    },
    promedioCalificacion: {
      type: DataTypes.FLOAT,
      defaultValue: 0
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

  // Método para recalcular el promedio de calificaciones
  Producto.recalcularPromedio = async function (productoId, ResenaModel) {
    const resenas = await ResenaModel.findAll({
      where: { productoId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const promedio = resenas.length > 0
      ? resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length
      : 0;

    await Producto.update(
      { promedioCalificacion: promedio },
      { where: { id: productoId } }
    );
  };

  return Producto;
};









  
