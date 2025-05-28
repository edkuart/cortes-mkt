//📁 screens/RegistroScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.API_URL || 'http://192.168.1.100:4000';

const RegistroScreen = () => {
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });

      const data = await res.json();

      if (res.ok) {
        await login(data.token, data.usuario);
        Alert.alert('Registro exitoso', `Bienvenido ${data.usuario.nombre}`);
      } else {
        Alert.alert('Error', data.mensaje || 'No se pudo registrar');
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? 'Registrando...' : 'Registrarse'} onPress={handleRegistro} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default RegistroScreen;