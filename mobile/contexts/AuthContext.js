// 📂 contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const usuarioJSON = await AsyncStorage.getItem('usuario');

        if (token && usuarioJSON) {
          const usuarioParseado = JSON.parse(usuarioJSON);
          setUsuario(usuarioParseado);
          console.log("🔄 Sesión restaurada:", usuarioParseado);
        }
      } catch (err) {
        console.error("⚠️ Error al restaurar sesión:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const login = async (token, usuarioData) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('usuario', JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUsuario(null);
  };

  if (cargando) return null;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

