import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoardScreen from './src/screens/BoardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Board" 
          component={BoardScreen} 
          options={{ title: 'Whiteboard Kelompok 5' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}