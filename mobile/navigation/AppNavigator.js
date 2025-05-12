// 📂 navigation/AppNavigator.js

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import DashboardVendedor from '../screens/DashboardVendedor';
import MisPedidos from '../screens/MisPedidos';
import ProductoDetalle from '../screens/ProductoDetalle';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import DevolucionesScreen from '../screens/DevolucionesScreen';

const AppNavigator = () => {
  const { usuario } = useAuth();
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    if (usuario?.rol === 'vendedor') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DashboardVendedor' }],
      });
    }
  }, [usuario]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ marginTop: 60, padding: 20 }}>
        Estado de usuario: {usuario ? JSON.stringify(usuario) : 'No autenticado'}
      </Text>

      <Stack.Navigator>
        {!usuario ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegistroScreen} />
          </>
        ) : (
          <>
            {usuario.rol === 'vendedor' && (
              <Stack.Screen name="DashboardVendedor" component={DashboardVendedor} />
            )}
            <Stack.Screen name="MisPedidos" component={MisPedidos} />
            <Stack.Screen name="ProductoDetalle" component={ProductoDetalle} />
            <Stack.Screen name="Devoluciones" component={DevolucionesScreen} />

          </>
        )}
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;


