// 📂 App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { View, Text } from 'react-native';

console.log("✅ App.js cargado");

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Text>⏳ Cargando AppNavigator...</Text>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
}



