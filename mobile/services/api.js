// 📂 services/api.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export const apiFetch = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.mensaje || 'Error desconocido');

  return data;
};

