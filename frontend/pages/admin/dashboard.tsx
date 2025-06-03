// 📁 frontend/pages/admin/dashboard.tsx

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import ResumenKPI from '@/components/Admin/ResumenKPI';
import { FaUsers, FaBoxOpen, FaStar, FaShoppingCart, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import RutaProtegida from '@/components/RutaProtegida';
import TablaReportes from '@/components/Admin/Moderacion/TablaReportes';
import TablaUsuarios from '@/components/Admin/Usuarios/TablaUsuarios';
import { Usuario } from '@/types/admin';
import toast from 'react-hot-toast';

const DashboardAdmin = () => {
  const { user, token, isAuthenticated } = useAuth();

  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    productos: 0,
    reseñas: 0,
    pedidos: 0,
  });

  const [todosLosUsuarios, setTodosLosUsuarios] = useState<Usuario[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [errorAutenticacionUsuarios, setErrorAutenticacionUsuarios] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:4000/api/admin/resumen', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor al obtener resumen.' }));
        throw new Error(errorData.message || `Error HTTP ${res.status}`);
      }
      const data = await res.json();
      setEstadisticas({
        usuarios: data.totalUsuarios ?? 0,
        productos: data.totalProductos ?? 0,
        reseñas: data.totalResenas ?? 0,
        pedidos: data.totalPedidos ?? 0,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Estadísticas: ${msg}`);
    }
  }, [token]);

  const fetchTodosLosUsuarios = useCallback(async () => {
    if (!token) {
      setIsLoadingUsuarios(false);
      return;
    }
    setIsLoadingUsuarios(true);
    setErrorUsuarios(null);
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setErrorAutenticacionUsuarios('No autorizado. Iniciá sesión nuevamente como administrador.');
        return;
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor al obtener usuarios.' }));
        throw new Error(errorData.message || `Error HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setTodosLosUsuarios(data as Usuario[]);
      } else {
        throw new Error('Formato de datos de usuarios incorrecto.');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Usuarios: ${msg}`);
      setTodosLosUsuarios([]);
    } finally {
      setIsLoadingUsuarios(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated() && user?.rol === 'admin' && token) {
      fetchEstadisticas();
      fetchTodosLosUsuarios();
    }
  }, [isAuthenticated, user, token, fetchEstadisticas, fetchTodosLosUsuarios]);

  const cambiarEstadoUsuario = useCallback(async (id: number) => {
    if (!token) {
      toast.error('Autenticación requerida.');
      return;
    }
    const usuarioOriginal = todosLosUsuarios.find(u => u.id === id);
    if (!usuarioOriginal) return;
    const nuevoEstado = usuarioOriginal.estado === 'activo' ? 'bloqueado' : 'activo';
    setTodosLosUsuarios(prev => prev.map(u => (u.id === id ? { ...u, estado: nuevoEstado } : u)));
    try {
      const res = await fetch(`http://localhost:4000/api/admin/usuarios/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor al cambiar estado.' }));
        throw new Error(errorData.message || `Error HTTP ${res.status}`);
      }
      const actualizado = await res.json();
      setTodosLosUsuarios(prev => prev.map(u => (u.id === id ? { ...u, ...actualizado } : u)));
      toast.success(`Estado de ${actualizado.nombreCompleto} actualizado a ${actualizado.estado}.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Error al cambiar estado: ${msg}`);
      setTodosLosUsuarios(prev => prev.map(u => (u.id === id ? { ...u, estado: usuarioOriginal.estado } : u)));
    }
  }, [token, todosLosUsuarios]);

  if (errorAutenticacionUsuarios) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg font-semibold mb-4">🚫 {errorAutenticacionUsuarios}</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ir al login
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <Head><title>Panel del Administrador</title></Head>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Panel del Administrador</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ResumenKPI titulo="Usuarios Totales" valor={estadisticas.usuarios} icono={<FaUsers className="text-blue-500" />} color="bg-blue-100" />
          <ResumenKPI titulo="Productos Totales" valor={estadisticas.productos} icono={<FaBoxOpen className="text-green-500" />} color="bg-green-100" />
          <ResumenKPI titulo="Reseñas Totales" valor={estadisticas.reseñas} icono={<FaStar className="text-yellow-500" />} color="bg-yellow-100" />
          <ResumenKPI titulo="Pedidos Totales" valor={estadisticas.pedidos} icono={<FaShoppingCart className="text-purple-500" />} color="bg-purple-100" />
        </div>

        <RutaProtegida rolesPermitidos={['admin']}>
          <TablaReportes />

          {errorUsuarios && (
            <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              <FaExclamationTriangle className="inline mr-2" /> Error al cargar la lista de usuarios: {errorUsuarios}
            </div>
          )}
          {isLoadingUsuarios && !errorUsuarios && (
            <div className="text-center py-10">
              <FaSpinner className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          )}
          {!isLoadingUsuarios && !errorUsuarios && todosLosUsuarios && (
            <TablaUsuarios
              usuarios={todosLosUsuarios}
              onToggleEstado={cambiarEstadoUsuario}
            />
          )}
        </RutaProtegida>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
