const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// ✅ Importar modelos
const PedidoModel = require('./pedido.model');
const ProductoModel = require('./producto.model');
const ResenaModel = require('./resena.model');
const UsuarioModel = require('./usuario.model');
const InteraccionIAModel = require('./interaccionIA.model');
const EntregaModel = require('./entrega.model');
const VendedorModel = require('./vendedor.model');
const DetallePedidoModel = require('./detallePedido.model');
const DevolucionModel = require('./devolucion');
const RankingVendedorModel = require('./rankingVendedor.model');

// ✅ Inicializar modelos
const Pedido = PedidoModel(sequelize, DataTypes);
const Producto = ProductoModel(sequelize, DataTypes);
const Resena = ResenaModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const InteraccionIA = InteraccionIAModel(sequelize, DataTypes);
const Entrega = EntregaModel(sequelize, DataTypes);
const Vendedor = VendedorModel(sequelize, DataTypes);
const DetallePedido = DetallePedidoModel(sequelize, DataTypes);
const Devolucion = DevolucionModel(sequelize, DataTypes);
const RankingVendedor = RankingVendedorModel(sequelize, DataTypes);

console.log("🗂 Base de datos usada:", sequelize.options.storage);

// ✅ Asociaciones automáticas protegidas
Pedido.associate?.({ Usuario, DetallePedido, Entrega, Devolucion });
Producto.associate?.({ Resena, Vendedor });
Resena.associate?.({ Usuario, Producto });
Vendedor.associate?.({ Usuario, Producto, RankingVendedor });
Entrega.associate?.({ Pedido });
Usuario.associate?.({ Vendedor });
DetallePedido.associate?.({ Pedido, Producto });
Devolucion.associate?.({ Pedido });
RankingVendedor.associate?.({ Vendedor });

// ✅ Asociaciones manuales (en caso de no estar en los models)

RankingVendedor.belongsTo(Vendedor, { foreignKey: 'vendedorId' });
Vendedor.hasOne(RankingVendedor, { foreignKey: 'vendedorId' });

Producto.belongsTo(Vendedor, { foreignKey: 'vendedorId' });
Vendedor.hasMany(Producto, { foreignKey: 'vendedorId' });

Vendedor.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Vendedor, { foreignKey: 'usuarioId' });

Entrega.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Pedido.hasOne(Entrega, { foreignKey: 'pedidoId' });

DetallePedido.belongsTo(Producto, { foreignKey: 'productoId' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Devolucion.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Pedido.hasMany(Devolucion, { foreignKey: 'pedidoId' });

// ✅ Exportar modelos
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
  Devolucion,
  RankingVendedor
};

