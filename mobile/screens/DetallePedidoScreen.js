// 📂 screens/DetallePedidoScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetallePedidoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `Pedido #${pedidoId}` });

    const obtenerDetalle = async () => {
      try {
        const res = await fetch(`http://192.168.1.173:4000/api/pedidos/${pedidoId}`);
        const data = await res.json();
        setPedido(data);
      } catch (err) {
        console.error('Error al obtener detalle del pedido:', err);
      } finally {
        setLoading(false);
      }
    };
    obtenerDetalle();
  }, [pedidoId]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!pedido) return <Text style={{ marginTop: 40, textAlign: 'center' }}>No se pudo cargar el pedido.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🧾 Pedido #{pedido.id}</Text>
      <Text style={styles.estado}>Estado: {pedido.estadoTexto}</Text>
      <Text style={styles.fecha}>Fecha: {new Date(pedido.createdAt).toLocaleDateString()}</Text>

      <Text style={styles.subtitulo}>🛒 Productos:</Text>
      {pedido.detalles.map((d, i) => (
        <View key={i} style={styles.productoItem}>
          <Text style={styles.nombre}>{d.producto?.nombre || 'Producto'}</Text>
          <Text style={styles.info}>Cantidad: {d.cantidad}</Text>
          <Text style={styles.info}>Precio unitario: Q{d.producto?.precio.toFixed(2)}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: Q{pedido.total.toFixed(2)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  productoItem: { marginBottom: 12, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  nombre: { fontWeight: 'bold' },
  info: { fontSize: 14 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'right' },
  estado: { fontSize: 14, marginBottom: 4 },
  fecha: { fontSize: 14, marginBottom: 8 },
});

export default DetallePedidoScreen;
