import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import { Badge } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";
import UserNavigator from "./UserNavigator";
import Home from "../Screens/Home";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

const Tab = createBottomTabNavigator();

const Main = () => {
  const cartItems = useSelector((state) => state.cartItems); // Access cartItems from Redux state

  // Calculate total number of items in the cart
  const cartItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        hideOnKeyboard: true,
        showLabel: false,
        tabBarActiveTintColor: "black",
        inactiveTintColor: "white",
        activeBackgroundColor: "white",
        inactiveBackgroundColor: "black",
        activeTintColor: "black",
      }}
    >
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="shopping-cart" style={{ position: "relative" }} color={color} size={30} />
              {cartItemsCount > 0 && (
                <Badge style={styles.badge} size={20}>
                  {cartItemsCount}
                </Badge>
              )}
            </View>
          ),
          tabBarLabel: '', // Hide the name from the tab
          headerShown: false // Hide header for the Cart screen
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon focused={focused} />
          ),
          tabBarLabel: '', // Hide the name from the tab
          headerShown: false // Hide header for the Cart screen
        }}
      />
      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" style={{ position: "relative" }} color={color} size={30} />
          ),
          tabBarLabel: '', // Hide the name from the tab
          headerShown: false // Hide header for the Cart screen
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBarIcon = ({ focused }) => (
  <Image
    source={require("../assets/Logo.png")}
    style={{ width: 40, height: 40, tintColor: focused ? "black" : "white" }}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
  },
});

export default Main;
