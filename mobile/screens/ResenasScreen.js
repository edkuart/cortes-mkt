// 📂 screens/ResenasScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { apiFetch } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const ResenasScreen = () => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { usuario } = useAuth();

  useEffect(() => {
    const cargarResenas = async () => {
      try {
        const data = await apiFetch(`/api/resenas/vendedor/${usuario.id}`);
        setResenas(data);
      } catch (error) {
        console.error('❌ Error al obtener reseñas:', error.message);
      } finally {
        setCargando(false);
      }
    };

    if (usuario?.id) cargarResenas();
  }, [usuario]);

  if (cargando) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (resenas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No hay reseñas disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={resenas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>{item.Comprador?.nombreCompleto || 'Cliente desconocido'}</Text>
            <Text>⭐ {item.calificacion}</Text>
            <Text style={styles.comentario}>
              "{item.comentario}"
            </Text>
            <Text style={styles.fecha}>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#fff8dc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cliente: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  comentario: { fontStyle: 'italic', marginVertical: 4 },
  fecha: { fontSize: 12, color: '#555' },
  empty: { marginTop: 20, textAlign: 'center', fontSize: 16 },
});

export default ResenasScreen;

