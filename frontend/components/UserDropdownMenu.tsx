// 📁 components/UserDropdownMenu.tsx

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cerrarSesionGlobal } from '@/hooks/useCerrarSesion'; // 🔁 Hook global para cerrar sesión

interface Props {
  avatar?: string;
  nombre?: string;
  logout?: () => void;
}

const UserDropdownMenu = ({ avatar, nombre = 'Usuario', logout }: Props) => {
  const router = useRouter();
  const [usuario, setUsuario] = useState<{ nombreCompleto: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      setUsuario(JSON.parse(data));
    }
  }, []);

  const displayName = (usuario?.nombreCompleto && usuario.nombreCompleto.trim() !== '') 
    ? usuario.nombreCompleto 
    : (nombre?.trim() !== '' ? nombre : '');

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 shadow-md transition duration-200 ease-in">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
            {displayName ? displayName.charAt(0) : 'U'}
          </div>
        )}
        <span className="text-sm font-medium whitespace-nowrap truncate max-w-[120px]">{displayName || 'Usuario'}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 shadow-xl">
        <ul className="py-1">
          <li>
            <button
              onClick={() => router.push('/perfil')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Mi Perfil
            </button>
          </li>
          <li>
            <Link href="/cambiar-password">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cambiar Contraseña
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={logout || (() => cerrarSesionGlobal(router))}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropdownMenu;