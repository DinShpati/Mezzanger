import 'react-native-gesture-handler';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import ChangePFP from './screens/ChangePFP';
import { LogBox, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ErrorRecovery from 'expo-error-recovery';
import _ from 'lodash';

if (Platform.OS === 'ios') {
  // do something for ios
} else if (Platform.OS === 'android') {
  LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
  LogBox.ignoreAllLogs(); // ignore all logs
  const _console = _.clone(console);
  console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
    }
  };
} else if (Platform.OS === 'web') {
  // it's on web!
} else {
  // you probably won't end up here unless you support another platform!
}


const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: {backgroundColor: '#dd0b92'},
  headerTitleStyle: {color: 'white'},
  headerTintColor: "white",
  headerTitleAlign: 'center',
  headerLayoutPreset: 'center'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddChat" component={AddChatScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ChangePFP" component={ChangePFP} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
