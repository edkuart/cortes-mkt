module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', {
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'comprador'
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true
  });

  return Usuario;
};
  
