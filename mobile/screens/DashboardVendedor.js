// 📂 screens/DashboardVendedor.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { apiFetch } from '../services/api';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const DashboardVendedor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();
  const { logout } = useAuth();

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const data = await apiFetch('/api/pedidos/vendedor');
        setPedidos(data);
      } catch (error) {
        console.error("❌ Error al cargar pedidos:", error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  if (cargando) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (pedidos.length === 0) {
    return (
      <View style={styles.container}>
        <Button title="Ver Devoluciones" onPress={() => navigation.navigate('ProductoDetalle', { pedidoId: item.id })} />
        <Button title="Cerrar sesión" onPress={logout} color="#dc3545" />
        <Text style={styles.empty}>No hay pedidos disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Ver Devoluciones" onPress={() => navigation.navigate('Devoluciones')} />
      <Button title="Cerrar sesión" onPress={logout} color="#dc3545" />
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductoDetalle', { pedidoId: item.id })}>
            <View style={styles.card}>
              <Text style={styles.titulo}>Pedido #{item.id}</Text>
              <Text>Total: Q{item.total?.toFixed(2)}</Text>
              <Text>Estado: {item.estadoTexto || 'pendiente'}</Text>
              <Text>Fecha: {dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  titulo: { fontWeight: 'bold', marginBottom: 4 },
  empty: { marginTop: 20, textAlign: 'center', fontSize: 16 },
});

export default DashboardVendedor;

