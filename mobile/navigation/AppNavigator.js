// 📂 navigation/AppNavigator.js

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import DashboardVendedor from '../screens/DashboardVendedor';
import MisPedidos from '../screens/MisPedidosScreen';
import ProductoDetalle from '../screens/ProductoDetalle';
import CrearResenaScreen from '../screens/CrearResenaScreen';
import DevolucionesScreen from '../screens/DevolucionesScreen';
import DetallePedidoScreen from '../screens/DetallePedidoScreen';
import { useAuth } from '../contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { usuario } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={usuario ? 'DashboardVendedor' : 'Login'} screenOptions={{ headerShown: false }}>
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
            <Stack.Screen name="DetallePedido" component={DetallePedidoScreen} />
            <Stack.Screen name="CrearResena" component={CrearResenaScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;