import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";
import UserNavigator from "./UserNavigator";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const Main = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                hideOnKeyboard: true,
                showLabel: false,
                tabBarActiveTintColor: 'black',
                inactiveTintColor: 'white',
                activeBackgroundColor: 'white',
                inactiveBackgroundColor: 'black',
                activeTintColor: 'black',
            }}
           
        >
            <Tab.Screen
                name="Cart"
                component={CartNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="shopping-cart" style={{ position: "relative" }} color={color} size={30} />
                    )
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabBarIcon focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={UserNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="user" style={{ position: "relative" }} color={color} size={30} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

const CustomTabBarIcon = ({ focused }) => (
    <Image
        source={require("../assets/Logo.png")}
        style={{ width: 40, height: 40, tintColor: focused ? 'black' : 'white' }}
        resizeMode="contain"
    />
);

export default Main;
