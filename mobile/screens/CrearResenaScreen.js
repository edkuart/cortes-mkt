// 📁 mobile/screens/CrearResenaScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const CrearResenaScreen = ({ route }) => {
  const { vendedorId } = route.params;
  const { token } = useAuth();
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState('5');

  const enviarResena = async () => {
    if (!comentario.trim()) {
      Alert.alert('⚠️ Comentario requerido');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          vendedorId,
          comentario,
          calificacion: parseInt(calificacion)
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('✅ Reseña enviada');
        setComentario('');
        setCalificacion('5');
      } else {
        Alert.alert('❌ Error', data.mensaje || 'No se pudo enviar la reseña');
      }
    } catch (err) {
      Alert.alert('❌ Error de red');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calificación (1 a 5)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={calificacion}
        onChangeText={setCalificacion}
      />

      <Text style={styles.label}>Comentario</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={comentario}
        onChangeText={setComentario}
      />

      <Button title="Enviar Reseña" onPress={enviarResena} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});