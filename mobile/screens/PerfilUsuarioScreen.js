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


// 📁 backend/controllers/usuariosController.js

const bcrypt = require('bcryptjs');
const { usuario } = require('../models');

exports.actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, correo, contrasenaActual, nuevaContrasena } = req.body;

  try {
    const usuarioDB = await usuario.findByPk(id);
    if (!usuarioDB) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Validar si el usuario es dueño de la cuenta o tiene permiso
    if (req.usuario.id !== parseInt(id) && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tenés permiso para modificar este perfil' });
    }

    // Verificar contraseña actual si desea cambiarla
    if (nuevaContrasena) {
      const match = await bcrypt.compare(contrasenaActual, usuarioDB.contraseña);
      if (!match) return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
      usuarioDB.contraseña = await bcrypt.hash(nuevaContrasena, 10);
    }

    usuarioDB.nombreCompleto = nombreCompleto || usuarioDB.nombreCompleto;
    usuarioDB.correo = correo || usuarioDB.correo;
    await usuarioDB.save();

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// 📁 backend/routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken } = require('../middleware/authMiddleware');

router.patch('/:id', verificarToken, usuariosController.actualizarPerfil);

module.exports = router;

