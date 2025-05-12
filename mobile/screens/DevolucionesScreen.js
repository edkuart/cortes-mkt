// 📂 screens/DevolucionesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { apiFetch } from '../services/api';
import dayjs from 'dayjs';

const DevolucionesScreen = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDevoluciones = async () => {
    try {
      const data = await apiFetch('/api/devoluciones');
      setDevoluciones(data);
    } catch (error) {
      console.error('❌ Error al obtener devoluciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las devoluciones');
    } finally {
      setCargando(false);
    }
  };

  const aceptar = async (id) => {
    try {
      await apiFetch(`/api/devoluciones/${id}/aceptar`, { method: 'PATCH' });
      setDevoluciones(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      Alert.alert('Error', 'No se pudo aceptar la devolución');
    }
  };

  const rechazar = async (id) => {
    try {
      await apiFetch(`/api/devoluciones/${id}/rechazar`, { method: 'PATCH' });
      setDevoluciones(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      Alert.alert('Error', 'No se pudo rechazar la devolución');
    }
  };

  useEffect(() => {
    cargarDevoluciones();
  }, []);

  if (cargando) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <FlatList
      data={devoluciones}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.empty}>No hay devoluciones pendientes.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>Motivo: {item.motivo}</Text>
          <Text>Pedido: #{item.pedidoId}</Text>
          <Text>Fecha: {dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
          <View style={styles.buttons}>
            <Button title="Aceptar" onPress={() => aceptar(item.id)} color="green" />
            <Button title="Rechazar" onPress={() => rechazar(item.id)} color="red" />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff4dc',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontWeight: 'bold', marginBottom: 4 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  empty: { textAlign: 'center', marginTop: 100, fontSize: 16 },
});

export default DevolucionesScreen;
