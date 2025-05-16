// 📁 backend/utils/actualizarRanking.js

const { Resena, Pedido, RankingVendedor } = require('../models');
const { Op } = require('sequelize');

async function actualizarRankingDeVendedor(vendedorId) {
  const resenas = await Resena.findAll({
    where: { vendedorId }
  });

  const promedio =
    resenas.length > 0
      ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length
      : 0;

  // Si tenés pedidos relacionados con vendedorId (opcional)
  let ventasTotales = 0;
  let montoTotal = 0;

  if (Pedido.rawAttributes?.vendedorId) {
    const pedidos = await Pedido.findAll({
      where: {
        vendedorId,
        estado: 'entregado'
      }
    });

    ventasTotales = pedidos.length;
    montoTotal = pedidos.reduce((acc, p) => acc + p.total, 0);
  }

  await RankingVendedor.upsert({
    vendedorId,
    promedioCalificacion: promedio,
    ventasTotales,
    montoTotal,
    fechaActualizacion: new Date()
  });
}

module.exports = { actualizarRankingDeVendedor };
