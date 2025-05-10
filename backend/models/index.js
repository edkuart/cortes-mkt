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
const EntregaModel = require('./entrega.model');
const VendedorModel = require('./vendedor.model');
const DetallePedidoModel = require('./detallePedido.model');

// Inicializar modelos
const Pedido = PedidoModel(sequelize, DataTypes);
const Producto = ProductoModel(sequelize, DataTypes);
const Resena = ResenaModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const InteraccionIA = InteraccionIAModel(sequelize, DataTypes);
const Entrega = EntregaModel(sequelize, DataTypes);
const Vendedor = VendedorModel(sequelize, DataTypes);
const DetallePedido = DetallePedidoModel(sequelize, DataTypes);

// Relaciones
if (Usuario && Resena) {
  Resena.belongsTo(Usuario, { as: 'Comprador', foreignKey: 'compradorId' });
}

Producto.belongsTo(Vendedor, { foreignKey: 'vendedorId' });
Vendedor.hasMany(Producto, { foreignKey: 'vendedorId' });

Vendedor.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Vendedor, { foreignKey: 'usuarioId' });

Entrega.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Pedido.hasOne(Entrega, { foreignKey: 'pedidoId' });

DetallePedido.belongsTo(Producto, { foreignKey: 'productoId' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Pedido.hasMany(DetallePedido, { foreignKey: 'pedidoId', as: 'detalles' });

// Exportar
module.exports = {
  sequelize,
  Pedido,
  Producto,
  Resena,
  Usuario,
  InteraccionIA,
  Entrega,
  Vendedor,
  DetallePedido,
};
