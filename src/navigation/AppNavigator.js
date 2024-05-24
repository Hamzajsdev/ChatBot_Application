import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatApp from '../screen/Chat/ChatApp';
import SignUp from '../screen/Auth/SignUp';
import Login from '../screen/Auth/Login';
import MAin from '../screen/Home/MAin';
import Chating from '../screen/Chat/Chating';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='ChatApp' component={ChatApp} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='MAin' component={MAin} />
        <Stack.Screen name='Chating' component={Chating}  />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator