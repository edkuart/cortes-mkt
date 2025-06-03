// 📁 backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { Mensaje, Reporte, Usuario } = require('../models'); // Reporte y Usuario ya estaban
const { Op } = require('sequelize');

// --- CAMBIO AQUÍ: Importar de adminController y authMiddleware ---
const adminController = require('../controllers/adminController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware'); // Asumiendo que authMiddleware exporta así
// Si verificarToken viene de otro lado, ajusta la importación. Por tu código anterior, parece que estaba separado.
// Si verificarToken y verificarRol están en el mismo archivo, está bien.

// --- FIN CAMBIO ---

const { obtenerConversaciones } = require('../controllers/mensajesController');


// --- INICIO: Nueva Ruta para el Resumen del Dashboard ---
router.get(
  '/resumen',
  verificarToken,
  verificarRol('admin'), // Asegúrate que el admin tenga este rol
  adminController.obtenerResumenDashboard
);
// --- FIN: Nueva Ruta para el Resumen del Dashboard ---


// ✅ Ruta protegida: obtener mensajes entre admin autenticado y otro usuario
router.get('/mensajes/:otroUsuarioId', verificarToken, async (req, res) => {
  const emisorId = req.usuario?.id;
  const receptorIdRaw = req.params.otroUsuarioId;
  const receptorId = parseInt(receptorIdRaw);

  console.log('🧪 Param recibido en /mensajes/:otroUsuarioId:', receptorIdRaw); // Log más específico
  console.log('👤 ID autenticado en /mensajes/:otroUsuarioId:', emisorId); // Log más específico

  if (!receptorIdRaw || isNaN(receptorId)) {
    return res.status(400).json({ mensaje: 'ID de receptor inválido (NaN)' });
  }

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { emisorId, receptorId },
          { emisorId: receptorId, receptorId: emisorId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });
    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al obtener mensajes', error: error.message }); // Enviar error.message
  }
});

// ✅ Ruta protegida: obtener lista de conversaciones activas
// Nota: Esta ruta usa verificarToken pero no verificarRol('admin'). Ajusta si es necesario.
router.get('/mensajes/conversaciones', verificarToken, obtenerConversaciones);

// ✅ GET todos los reportes
// Esta ruta ya estaba, solo asegúrate que verificarRol('admin') esté si es requerida.
// Por el contexto, parece que /api/reportes es manejada por reportesRoutes.js,
// y aquí en adminRoutes.js es /api/admin/reportes. Confirma cuál es la correcta para el frontend.
// Si tu frontend llama a /api/reportes, entonces la lógica de reportes debe estar en reportesRoutes.js
// y esta sección aquí podría ser para una vista de admin diferente o redundante.
// Asumiré que el frontend llama a la ruta montada en reportesRoutes.js.
// Si el frontend llama a /api/admin/reportes, entonces esta es la correcta.
router.get('/reportes', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      // La asociación en tu modelo Reporte era: Reporte.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      // Por defecto, Sequelize usa el nombre del modelo como 'as' (Usuario) o el nombre que le des en 'as' en la asociación.
      // Si no definiste un 'as: "autor"' en Reporte.belongsTo(Usuario), este 'as' podría fallar.
      // Prueba sin 'as' o con 'as: "usuario"' si es el nombre por defecto o el foreignKey.
      include: [{ model: Usuario, attributes: ['id', 'nombreCompleto', 'correo'] }], // Eliminado 'as: "autor"' temporalmente para probar
      order: [['createdAt', 'DESC']],
    });
    res.json(reportes);
  } catch (error) {
    console.error('❌ Error al obtener reportes (admin):', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes (admin)', error: error.message });
  }
});

// ✅ PATCH resolver un reporte
router.patch('/reportes/:id/resolver', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (!reporte) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    reporte.estado = 'resuelto';
    await reporte.save();
    res.json({ mensaje: 'Reporte resuelto', reporte }); // Devuelve el reporte actualizado
  } catch (error) {
    console.error('❌ Error al resolver reporte (admin):', error);
    res.status(500).json({ mensaje: 'Error al resolver reporte (admin)', error: error.message });
  }
});

// ✅ GET ranking de vendedores
// La protección verificarRol('admin') es buena aquí.
router.get('/ranking-vendedores', verificarToken, verificarRol('admin'), adminController.obtenerRankingVendedoresSimulado); // Usando una función del controlador

// ✅ GET /admin/usuarios - lista todos los usuarios
// La protección verificarRol('admin') es buena aquí.
router.get('/usuarios', verificarToken, verificarRol('admin'), adminController.obtenerTodosLosUsuarios); // Usando una función del controlador

// ✅ PATCH /admin/usuarios/:id/estado - cambia el estado de un usuario
// La protección verificarRol('admin') es buena aquí.
router.patch('/usuarios/:id/estado', verificarToken, verificarRol('admin'), adminController.cambiarEstadoUsuario); // Usando una función del controlador


module.exports = router;
