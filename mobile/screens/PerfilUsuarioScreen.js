// 📁 mobile/screens/PerfilUsuarioScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const PerfilUsuarioScreen = () => {
  const { usuario, token } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setCorreo(usuario.correo);
    }
  }, [usuario]);

  const guardarCambios = async () => {
    if (!usuario) return;

    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${usuario.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify({
          nombreCompleto: nombre,
          correo,
          contrasenaActual,
          nuevaContrasena: nuevaContrasena || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('✅ Éxito', 'Perfil actualizado correctamente.');
        setContrasenaActual('');
        setNuevaContrasena('');
      } else {
        Alert.alert('⚠️ Error', data.mensaje || 'No se pudo actualizar el perfil');
      }
    } catch (err) {
      Alert.alert('❌ Error', 'Hubo un problema al actualizar el perfil');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña actual</Text>
      <TextInput
        style={styles.input}
        value={contrasenaActual}
        onChangeText={setContrasenaActual}
        secureTextEntry
      />

      <Text style={styles.label}>Nueva contraseña (opcional)</Text>
      <TextInput
        style={styles.input}
        value={nuevaContrasena}
        onChangeText={setNuevaContrasena}
        secureTextEntry
      />

      <Button title="Guardar cambios" onPress={guardarCambios} color="#1E88E5" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default PerfilUsuarioScreen;

