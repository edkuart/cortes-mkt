// 📁 mobile/screens/MisPedidosScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const MisPedidosScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/pedidos', {
          headers: {
            Authorization: token,
          },
        });
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al cargar pedidos del cliente:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  const confirmarEntrega = async (pedidoId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/entregas/${pedidoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ confirmacionCliente: true }),
      });

      if (res.ok) {
        Alert.alert('✅ Entrega confirmada');
        setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, estado: 'entregado' } : p));
      } else {
        Alert.alert('❌ Error al confirmar entrega');
      }
    } catch (error) {
      Alert.alert('❌ Error de red');
    }
  };

  if (cargando) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>Pedido #{item.id}</Text>
            <Text>Total: Q{item.total?.toFixed(2)}</Text>
            <Text>Estado: {item.estado}</Text>
            <Text>Fecha: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>
            {item.estado !== 'entregado' && (
              <Button title="Confirmar Entrega" onPress={() => confirmarEntrega(item.id)} color="#2196F3" />
            )}
            <Button
              title="Dejar Reseña"
              onPress={() => navigation.navigate('CrearResena', { vendedorId: item.vendedorId })}
              color="#4CAF50"
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  titulo: { fontWeight: 'bold', marginBottom: 4 },
});

export default MisPedidosScreen;
