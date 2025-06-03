// backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // Puedes poner true temporalmente para ver las queries SQL en la consola del backend
});

// ✅ Importar modelos (definiciones de funciones)
const PedidoModelFunc = require('./pedido.model');
const ProductoModelFunc = require('./producto.model');
const ResenaModelFunc = require('./resena.model');
const UsuarioModelFunc = require('./usuario.model');
const InteraccionIAModelFunc = require('./interaccionIA.model');
const EntregaModelFunc = require('./entrega.model');
const VendedorModelFunc = require('./vendedor.model');
const DetallePedidoModelFunc = require('./detallePedido.model');
const DevolucionModelFunc = require('./devolucion');
const RankingVendedorModelFunc = require('./rankingVendedor.model');
const HistorialProductoModelFunc = require('./historialProducto');
const FavoritoModelFunc = require('./favorito.model');
const MensajeModelFunc = require('./mensaje.model');
const ReporteModelFunc = require('./reporte'); // --- CAMBIO AQUÍ --- Importar la función del modelo Reporte

// ✅ Inicializar modelos y guardarlos en un objeto 'db' para pasarlos a las asociaciones
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Pedido = PedidoModelFunc(sequelize, DataTypes);
db.Producto = ProductoModelFunc(sequelize, DataTypes);
db.Resena = ResenaModelFunc(sequelize, DataTypes);
db.Usuario = UsuarioModelFunc(sequelize, DataTypes);
db.InteraccionIA = InteraccionIAModelFunc(sequelize, DataTypes);
db.Entrega = EntregaModelFunc(sequelize, DataTypes);
db.Vendedor = VendedorModelFunc(sequelize, DataTypes);
db.DetallePedido = DetallePedidoModelFunc(sequelize, DataTypes);
db.Devolucion = DevolucionModelFunc(sequelize, DataTypes);
db.RankingVendedor = RankingVendedorModelFunc(sequelize, DataTypes);
db.HistorialProducto = HistorialProductoModelFunc(sequelize, DataTypes);
db.Favorito = FavoritoModelFunc(sequelize, DataTypes);
db.Mensaje = MensajeModelFunc(sequelize, DataTypes);
db.Reporte = ReporteModelFunc(sequelize, DataTypes); // --- CAMBIO AQUÍ --- Inicializar Reporte y guardarlo en db

console.log("🗂 Base de datos usada:", sequelize.options.storage);


// ✅ Llamar a las funciones de asociación de cada modelo
// Es una buena práctica iterar sobre los modelos en `db` y llamar a `associate` si existe.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // --- CAMBIO AQUÍ --- Llamada general a las asociaciones
  }
});

// Las asociaciones manuales que tenías podrían ser redundantes si las defines
// correctamente dentro de los métodos `associate` de cada modelo.
// Si las mantienes, asegúrate de que no entren en conflicto.
// Por ejemplo, Reporte.associate ya define Reporte.belongsTo(Usuario).

/* // Ejemplo de tus asociaciones manuales (revisar si son necesarias después de llamar a .associate)
db.RankingVendedor.belongsTo(db.Vendedor, { foreignKey: 'vendedorId' });
db.Vendedor.hasOne(db.RankingVendedor, { foreignKey: 'vendedorId' });

db.Producto.belongsTo(db.Vendedor, { foreignKey: 'vendedorId' });
db.Vendedor.hasMany(db.Producto, { foreignKey: 'vendedorId' });

db.Vendedor.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });
db.Usuario.hasOne(db.Vendedor, { foreignKey: 'usuarioId' });

// ... y así sucesivamente para las otras asociaciones manuales.
// Es mejor si estas están definidas dentro de los archivos de modelo correspondientes
// en sus respectivos métodos `associate`.
*/


// ✅ Exportar modelos para que puedan ser importados con destructuring
module.exports = {
  sequelize: db.sequelize, // Exportar la instancia de sequelize
  Sequelize: db.Sequelize, // Exportar la clase Sequelize
  Pedido: db.Pedido,
  Producto: db.Producto,
  Resena: db.Resena,
  Usuario: db.Usuario,
  InteraccionIA: db.InteraccionIA,
  Entrega: db.Entrega,
  Vendedor: db.Vendedor,
  DetallePedido: db.DetallePedido,
  Devolucion: db.Devolucion,
  RankingVendedor: db.RankingVendedor,
  HistorialProducto: db.HistorialProducto,
  Favorito: db.Favorito,
  Mensaje: db.Mensaje,
  Reporte: db.Reporte, // --- CAMBIO AQUÍ --- Exportar el modelo Reporte
};