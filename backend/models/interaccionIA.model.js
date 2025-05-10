// backend/models/interaccionIA.model.js

module.exports = (sequelize, DataTypes) => {
  const InteraccionIA = sequelize.define('InteraccionIA', {
    prompt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return InteraccionIA;
};





