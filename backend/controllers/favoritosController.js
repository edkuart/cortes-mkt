// 📁 controllers/favoritosController.js

const { Favorito, Producto } = require('../models');
const { Op } = require('sequelize');

exports.obtenerFavoritos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const favoritos = await Favorito.findAll({
      where: { usuarioId },
      include: [{ model: Producto }]
    });
    res.json(favoritos.map(f => f.Producto));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

exports.agregarFavorito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.body;
    const [favorito, creado] = await Favorito.findOrCreate({ where: { usuarioId, productoId } });
    res.status(creado ? 201 : 200).json(favorito);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo agregar a favoritos' });
  }
};

exports.eliminarFavorito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    await Favorito.destroy({ where: { usuarioId, productoId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'No se pudo eliminar favorito' });
  }
};

exports.contarFavoritosPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const total = await Favorito.count({ where: { productoId } });
    res.json({ productoId, total });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo contar los favoritos' });
  }
};

exports.obtenerSugerenciasPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;

    // 1. Usuarios que marcaron este producto
    const favoritosDelProducto = await Favorito.findAll({
      where: { productoId },
      attributes: ['usuarioId']
    });
    const usuariosIds = favoritosDelProducto.map(f => f.usuarioId);

    if (!usuariosIds.length) {
      return res.json([]); // Nadie lo ha marcado
    }

    // 2. Otros productos que esos usuarios han marcado como favoritos
    const otrosFavoritos = await Favorito.findAll({
      where: {
        usuarioId: { [Op.in]: usuariosIds },
        productoId: { [Op.ne]: productoId }
      },
      attributes: ['productoId'],
    });

    // 3. Contar frecuencia por productoId
    const conteo = {};
    otrosFavoritos.forEach(fav => {
      conteo[fav.productoId] = (conteo[fav.productoId] || 0) + 1;
    });

    // 4. Ordenar y devolver top sugerencias
    const sugerencias = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productoId, veces]) => ({ productoId: parseInt(productoId), veces }));

    res.json(sugerencias);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener sugerencias' });
  }
};