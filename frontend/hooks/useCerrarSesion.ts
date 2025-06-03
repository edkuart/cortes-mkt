// 📁 hooks/useCerrarSesion.ts

import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

/**
 * Hook reutilizable para cerrar sesión desde cualquier componente
 */
export const useCerrarSesion = () => {
  const router = useRouter();

  const cerrarSesion = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      toast.success('Sesión cerrada correctamente.');
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Ocurrió un error al cerrar sesión.');
    }
  };

  return cerrarSesion;
};

/**
 * Función global reutilizable en callbacks directos
 */
export const cerrarSesionGlobal = (router: ReturnType<typeof useRouter>) => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    toast.success('Sesión cerrada correctamente.');
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    toast.error('Ocurrió un error al cerrar sesión.');
  }
};
