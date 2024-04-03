import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from "react";
 
import { NativeBaseProvider, extendTheme, } from "native-base";
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from "react-redux";
import store from "./Redux/store";
import Toast from "react-native-toast-message"
import Auth from './Context/Store/Auth';
import DrawerNavigator from './Navigators/DrawerNavigator';
import Main from './Navigators/Main';
const theme = extendTheme({ colors: newColorTheme });
const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};


export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            
          {isAdmin ? (
        <DrawerNavigator />
      ) : (
        <Main/>
      )}
            {/* <Main /> */}
            <Toast />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}


