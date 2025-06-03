// 📁 components/Admin/Moderacion/TablaReportes.tsx

import { useEffect, useState, useMemo } from 'react';
import { FaCheck, FaEye, FaTrash, FaFileExport, FaSort, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/Modal';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';

interface Reporte {
  id: number;
  tipo: 'producto' | 'reseña' | 'mensaje';
  motivo: string;
  contenidoId: number;
  descripcion?: string;
  estado: 'pendiente' | 'resuelto';
  createdAt: string;
  usuario: {
    nombreCompleto: string;
    correo: string;
  };
}

type ReporteSortableKeys = keyof Reporte | 'usuario.correo';

const TablaReportes = () => {
  const { token } = useAuth();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [modalDetalle, setModalDetalle] = useState<Reporte | null>(null);
  const [indiceModalActual, setIndiceModalActual] = useState<number | null>(null);
  const [configOrden, setConfigOrden] = useState<{ key: ReporteSortableKeys; direccion: 'asc' | 'desc'; } | null>({ key: 'createdAt', direccion: 'desc' });
  const [errorAutenticacion, setErrorAutenticacion] = useState<string | null>(null);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState<boolean>(true);

  const cargarReportes = async () => {
    if (!token) {
      toast.error('Token de autenticación no disponible');
      setErrorAutenticacion('Token ausente. Iniciá sesión nuevamente.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/reportes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setErrorAutenticacion('No autorizado. Iniciá sesión nuevamente como administrador.');
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("\u26a0\ufe0f Respuesta fallida:", res.status, text);
        throw new Error(`Error al cargar reportes: ${res.status}`);
      }

      const data = await res.json();
      const reportesArray = Array.isArray(data) ? data : data.reportes || [];

      if (!Array.isArray(reportesArray)) {
        console.error("\u26a0\ufe0f La API devolvió estructura inesperada:", data);
        throw new Error('Estructura inválida en la respuesta de reportes');
      }

      setReportes(reportesArray);
    } catch (error) {
      console.error('❌ Error al cargar reportes (final):', error);
      toast.error(`❌ Error al cargar reportes: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    if (token) {
      cargarReportes();
    }
  }, [token]);

  if (errorAutenticacion) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg font-semibold mb-4">🚫 {errorAutenticacion}</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ir al login
        </button>
      </div>
    );
  }

  const resolverReporte = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reportes/${id}/resolver`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al resolver');
      toast.success('✅ Reporte resuelto');
      cargarReportes(); // Recargar para reflejar el cambio
      if (modalDetalle && modalDetalle.id === id) { // Si el modal abierto es el resuelto, actualizarlo
        setModalDetalle(prev => prev ? {...prev, estado: 'resuelto'} : null);
      }
    } catch (error) {
      console.error('❌ Error al resolver reporte:', error);
      toast.error('❌ No se pudo resolver');
    }
  };

  const eliminarReporte = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reportes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('🗑 Reporte eliminado');
      if (modalDetalle && modalDetalle.id === id) { // Si el modal abierto es el eliminado, cerrarlo
        setModalDetalle(null);
        setIndiceModalActual(null);
      }
      cargarReportes(); // Recargar para reflejar el cambio
    } catch (error) {
      console.error('❌ Error al eliminar reporte:', error);
      toast.error('❌ No se pudo eliminar');
    }
  };

  // 🔍 Memoización para reportes filtrados y buscados
  const reportesFiltradosYBuscados = useMemo(() => {
    let reportesProcesados = Array.isArray(reportes) ? [...reportes] : [];

    if (filtroTipo) {
      reportesProcesados = reportesProcesados.filter((r) => r.tipo === filtroTipo);
    }
    if (filtroEstado) {
      reportesProcesados = reportesProcesados.filter((r) => r.estado === filtroEstado);
    }
    if (terminoBusqueda) {
      const lowerTermino = terminoBusqueda.toLowerCase();
      reportesProcesados = reportesProcesados.filter(
        (r) =>
          r.motivo.toLowerCase().includes(lowerTermino) ||
          (r.usuario && r.usuario.correo.toLowerCase().includes(lowerTermino))
      );
    }
    return reportesProcesados;
  }, [reportes, filtroTipo, filtroEstado, terminoBusqueda]);

  // Memoización para reportes ordenados
  const reportesOrdenados = useMemo(() => {
    let items = [...reportesFiltradosYBuscados];
    if (configOrden !== null) {
      items.sort((a, b) => {
        let valA, valB;

        // Manejo de acceso a propiedades anidadas (ej: 'usuario.correo')
        if (configOrden.key.includes('.')) {
          const keys = configOrden.key.split('.');
          valA = keys.reduce((obj: any, key: string) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, a);
          valB = keys.reduce((obj: any, key: string) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, b);
        } else {
          valA = a[configOrden.key as keyof Reporte];
          valB = b[configOrden.key as keyof Reporte];
        }
        
        // Tratamiento especial para fechas
        if (configOrden.key === 'createdAt') {
            valA = new Date(valA as string).getTime();
            valB = new Date(valB as string).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }


        if (valA === undefined || valA === null) return configOrden.direccion === 'asc' ? -1 : 1; // undefined/null primero o último
        if (valB === undefined || valB === null) return configOrden.direccion === 'asc' ? 1 : -1;


        if (valA < valB) return configOrden.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return configOrden.direccion === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [reportesFiltradosYBuscados, configOrden]);

  const solicitarOrden = (key: ReporteSortableKeys) => {
    let direccion: 'asc' | 'desc' = 'asc';
    if (configOrden && configOrden.key === key && configOrden.direccion === 'asc') {
      direccion = 'desc';
    }
    setConfigOrden({ key, direccion });
  };

  const abrirModalConReporte = (reporte: Reporte) => {
    const indice = reportesOrdenados.findIndex(r => r.id === reporte.id);
    setModalDetalle(reporte);
    setIndiceModalActual(indice);
  };

  const navegarModal = (direccion: 'siguiente' | 'anterior') => {
    if (indiceModalActual === null) return;

    let nuevoIndice = indiceModalActual;
    if (direccion === 'siguiente') {
      nuevoIndice = Math.min(indiceModalActual + 1, reportesOrdenados.length - 1);
    } else {
      nuevoIndice = Math.max(indiceModalActual - 1, 0);
    }

    if (nuevoIndice !== indiceModalActual) {
      setIndiceModalActual(nuevoIndice);
      setModalDetalle(reportesOrdenados[nuevoIndice]);
    }
  };


  const headersCSV = [
    { label: 'ID', key: 'id' },
    { label: 'Tipo', key: 'tipo' },
    { label: 'Motivo', key: 'motivo' },
    { label: 'Contenido ID', key: 'contenidoId' },
    { label: 'Usuario', key: 'usuario.correo' }, // Asegúrate que react-csv pueda acceder a anidados así
    { label: 'Estado', key: 'estado' },
    { label: 'Fecha', key: 'createdAt' },
    { label: 'Descripción', key: 'descripcion' },
  ];
  
  // Para CSV, es mejor aplanar los datos si 'usuario.correo' da problemas
  const datosParaCSV = useMemo(() => {
    return reportesOrdenados.map(r => ({
        ...r,
        'usuario.correo': r.usuario?.correo || 'N/A', // Aplanar para CSV
        createdAt: new Date(r.createdAt).toLocaleString(), // Formatear fecha para CSV
    }));
  }, [reportesOrdenados]);


  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Reportes de Usuarios ({reportesOrdenados.length})
        </h2>
        <CSVLink
          data={datosParaCSV} // Usar datos aplanados y formateados
          headers={headersCSV}
          filename={'reportes_filtrados.csv'}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-colors"
        >
          <FaFileExport /> Exportar CSV
        </CSVLink>
      </div>

      {/* 🔍 Input de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Buscar por correo o motivo..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:w-auto"
        >
          <option value="">Todos los tipos</option>
          <option value="producto">Producto</option>
          <option value="reseña">Reseña</option>
          <option value="mensaje">Mensaje</option>
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:w-auto"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
        </select>
        <button
          onClick={() => {
            setFiltroTipo('');
            setFiltroEstado('');
            setTerminoBusqueda('');
            setConfigOrden({ key: 'createdAt', direccion: 'desc' }); // Resetear orden
          }}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => solicitarOrden('tipo')}>
                Tipo <FaSort className="inline ml-1" />
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => solicitarOrden('motivo')}>
                Motivo <FaSort className="inline ml-1" />
              </th>
              <th className="px-5 py-3">ID Objetivo</th>
              <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => solicitarOrden('usuario.correo')}>
                Usuario <FaSort className="inline ml-1" />
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => solicitarOrden('createdAt')}>
                Fecha <FaSort className="inline ml-1" />
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => solicitarOrden('estado')}>
                Estado <FaSort className="inline ml-1" />
              </th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
            {reportesOrdenados.length > 0 ? (
              reportesOrdenados.map((reporte) => (
              <tr key={reporte.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap capitalize">{reporte.tipo}</td>
                <td className="px-5 py-4 whitespace-nowrap max-w-xs truncate" title={reporte.motivo}>{reporte.motivo}</td>
                <td className="px-5 py-4 whitespace-nowrap">#{reporte.contenidoId}</td>
                <td className="px-5 py-4 whitespace-nowrap">{reporte.usuario?.correo || '---'}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {new Date(reporte.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {reporte.estado === 'resuelto' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Resuelto
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap flex items-center gap-3">
                  <button
                    onClick={() => abrirModalConReporte(reporte)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver detalle"
                  >
                    <FaEye size={18} />
                  </button>
                  {reporte.estado === 'pendiente' && (
                    <button
                      onClick={() => resolverReporte(reporte.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Marcar como resuelto"
                    >
                      <FaCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarReporte(reporte.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar reporte"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                        No hay reportes que coincidan con los filtros seleccionados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalDetalle && (
        <Modal onClose={() => { setModalDetalle(null); setIndiceModalActual(null); }}>
          <div className="p-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Detalle del Reporte #{modalDetalle.id}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tipo:</strong> <span className="capitalize">{modalDetalle.tipo}</span></p>
              <p><strong>Motivo:</strong> {modalDetalle.motivo}</p>
              <p><strong>ID objetivo:</strong> #{modalDetalle.contenidoId}</p>
              <p><strong>Usuario:</strong> {modalDetalle.usuario?.correo}</p>
              <p><strong>Fecha:</strong> {new Date(modalDetalle.createdAt).toLocaleString()}</p>
              <p><strong>Estado:</strong> <span className={`font-semibold ${modalDetalle.estado === 'resuelto' ? 'text-green-600' : 'text-red-600'}`}>{modalDetalle.estado}</span></p>
              <p className="mt-1"><strong>Descripción:</strong></p>
              <p className="bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">{modalDetalle.descripcion || 'Sin descripción adicional.'}</p>
            </div>
            {/* Modal Navigation Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => navegarModal('anterior')}
                disabled={indiceModalActual === null || indiceModalActual === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaArrowLeft /> Anterior
              </button>
              <div>
                {indiceModalActual !== null && (
                  <span className="text-sm text-gray-500">
                    {indiceModalActual + 1} de {reportesOrdenados.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navegarModal('siguiente')}
                disabled={indiceModalActual === null || indiceModalActual === reportesOrdenados.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente <FaArrowRight />
              </button>
            </div>
             {modalDetalle.estado === 'pendiente' && (
                <button
                    onClick={() => resolverReporte(modalDetalle.id)}
                    className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors"
                >
                    Marcar como Resuelto
                </button>
            )}
            <button
                onClick={() => { setModalDetalle(null); setIndiceModalActual(null); }}
                className="w-full mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm transition-colors"
            >
                Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TablaReportes;
