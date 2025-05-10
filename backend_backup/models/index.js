const sequelize = require("../database/config");

const Usuario = require("./usuario.model");
const Producto = require("./producto.model");
const Pedido = require("./pedido.model");
const DetallePedido = require("./detallePedido.model");
const Reseña = require("./reseña.model");

// Relaciones
Usuario.hasMany(Pedido, { foreignKey: "compradorId" });
Pedido.belongsTo(Usuario, { foreignKey: "compradorId" });

Usuario.hasMany(Producto, { foreignKey: "vendedorId" });
Producto.belongsTo(Usuario, { foreignKey: "vendedorId" });

Pedido.hasMany(DetallePedido, {
  foreignKey: "pedidoId",
  as: "detalles",
});
DetallePedido.belongsTo(Pedido, {
  foreignKey: "pedidoId",
});


Producto.hasMany(DetallePedido, { foreignKey: "productoId" });
DetallePedido.belongsTo(Producto, { foreignKey: "productoId" });

Usuario.hasMany(Reseña, { foreignKey: "vendedorId", as: "ReseñasRecibidas" });
Usuario.hasMany(Reseña, { foreignKey: "compradorId", as: "ReseñasHechas" });

Reseña.belongsTo(Usuario, { foreignKey: "vendedorId", as: "Vendedor" });
Reseña.belongsTo(Usuario, { foreignKey: "compradorId", as: "Comprador" });

module.exports = {
  sequelize,
  Usuario,
  Producto,
  Pedido,
  DetallePedido,
  Reseña,
};
