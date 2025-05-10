// backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Importar modelos
const PedidoModel = require('./pedido.model');
const ProductoModel = require('./producto.model');
const ResenaModel = require('./resena.model');
const UsuarioModel = require('./usuario.model');
const InteraccionIAModel = require('./interaccionIA.model');

// Inicializar modelos
const Pedido = PedidoModel(sequelize, DataTypes);
const Producto = ProductoModel(sequelize, DataTypes);
const Resena = ResenaModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const InteraccionIA = InteraccionIAModel(sequelize, DataTypes);

// Relaciones
if (Usuario && Resena) {
  Resena.belongsTo(Usuario, { as: 'Comprador', foreignKey: 'compradorId' });
}

// Exportar
module.exports = {
  sequelize,
  Pedido,
  Producto,
  Resena,
  Usuario,
  InteraccionIA,
};









