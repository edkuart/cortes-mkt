// backend/models/usuario.js

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', { // El nombre del modelo aquí es 'usuario'
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: { // Considera usar 'contrasena' para evitar posibles problemas con la 'ñ' en algunos entornos/DB
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING, // O DataTypes.ENUM('comprador', 'vendedor', 'admin') si quieres restringir los valores
      defaultValue: 'comprador'
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // --- CAMBIO AQUÍ: Columna 'estado' añadida ---
    estado: {
      type: DataTypes.ENUM('activo', 'bloqueado'), // Define los valores permitidos para el estado
      defaultValue: 'activo',                     // Establece un valor por defecto
      allowNull: false                            // Asegura que siempre haya un estado
    }
    // --- FIN DEL CAMBIO ---
  }, {
    tableName: 'usuarios', // Nombre explícito de la tabla en la base de datos
    timestamps: true       // Esto añade automáticamente las columnas createdAt y updatedAt
  });

  // Si tienes asociaciones específicas para el modelo Usuario, irían aquí.
  // Por ejemplo, si un Usuario puede tener muchos Reportes o un perfil de Vendedor.
  // Usuario.associate = function(models) {
  //   // Ejemplo: Usuario.hasMany(models.Reporte, { foreignKey: 'usuarioId' });
  //   // Ejemplo: Usuario.hasOne(models.Vendedor, { foreignKey: 'usuarioId' });
  // };

  return Usuario;
};