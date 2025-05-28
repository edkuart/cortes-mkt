// 📁 backend/controllers/vendedoresController.js

const { Vendedor, RankingVendedor, Usuario } = require('../models');

exports.solicitarVendedor = async (req, res) => {
    try {
      const { usuarioId, nombreComercial } = req.body;
      const files = req.files;

      const nuevo = await Vendedor.create({
        usuarioId,
        nombreComercial,
        telefono: '00000000',
        direccion: 'Dirección por defecto',
        municipio: 'Municipio Xela',
        departamento: 'Quetzaltenango',
        estado: 'pendiente',
        fotoDPIFrente: files?.fotoDPIFrente?.[0]?.path,
        fotoDPIReverso: files?.fotoDPIReverso?.[0]?.path,
        selfieConDPI: files?.selfieConDPI?.[0]?.path,
        licenciaConducir: files?.licenciaConducir?.[0]?.path,
      });

      res.status(201).json({ mensaje: 'Solicitud enviada', data: nuevo });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al registrar vendedor', error: err });
    }
};

exports.crearVendedor = async (req, res) => {
  const { usuarioId } = req.body;

  try {
    // Validar existencia de usuario
    const usuarioExistente = await Usuario.findByPk(usuarioId);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const [vendedorData, creado] = await Vendedor.findOrCreate({
      where: { usuarioId },
      defaults: {
        telefono: '12345678',
        direccion: 'Zona 1, Xela',
        municipio: 'Quetzaltenango',
        departamento: 'Quetzaltenango',
        estado: 'pendiente'
      }
    });

    res.status(creado ? 201 : 200).json({
      mensaje: creado ? '✅ Vendedor creado' : 'ℹ️ El vendedor ya existe',
      vendedor: vendedorData
    });
  } catch (error) {
    console.error('❌ Error al crear vendedor:', error.message);
    res.status(500).json({ mensaje: 'Error al crear vendedor', error });
  }
};

exports.crearUsuarioYVendedor = async (req, res) => {
  const { Usuario, Vendedor } = require('../models');
  const bcrypt = require('bcryptjs');

  try {
    const existente = await Usuario.findOne({ where: { correo: 'test@correo.com' } });

    if (existente) {
      return res.status(200).json({ mensaje: '⚠️ Usuario ya existe', usuario: existente });
    }

    const hash = await bcrypt.hash('123456', 10);

    const nuevoUsuario = await Usuario.create({
      nombreCompleto: 'Preda Welch',
      correo: 'test@correo.com',
      contraseña: hash,
      rol: 'vendedor'
    });

    const nuevoVendedor = await Vendedor.create({
      usuarioId: nuevoUsuario.id,
      telefono: '12345678',
      direccion: 'Zona 1, Xela',
      municipio: 'Quetzaltenango',
      departamento: 'Quetzaltenango',
      estado: 'pendiente'
    });

    res.status(201).json({
      mensaje: '✅ Usuario y vendedor creados',
      usuario: nuevoUsuario,
      vendedor: nuevoVendedor
    });
  } catch (error) {
    console.error('❌ Error al crear usuario y vendedor:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario y vendedor', error });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const vendedorPerfil = await Vendedor.findByPk(req.params.id);
    if (!vendedorPerfil) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

    res.json(vendedorPerfil);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: err });
  }
};

exports.aprobarVendedor = async (req, res) => {
  try {
    const vendedorData = await Vendedor.findByPk(req.params.id);
    if (!vendedorData) return res.status(404).json({ mensaje: 'No existe la solicitud' });

    vendedorData.estado = 'aprobado';
    await vendedorData.save();

    res.json({ mensaje: 'Cuenta de vendedor aprobada' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al aprobar vendedor', error: err });
  }
};

exports.obtenerRankingVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const ranking = await RankingVendedor.findOne({ where: { vendedorId: id } });

    if (!ranking) {
      return res.status(404).json({ mensaje: 'Ranking no encontrado para este vendedor' });
    }

    res.json(ranking);
  } catch (error) {
    console.error('Error al obtener ranking del vendedor:', error);
    res.status(500).json({ mensaje: 'Error al obtener ranking' });
  }
};
