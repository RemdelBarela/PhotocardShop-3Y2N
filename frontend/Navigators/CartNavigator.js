import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Cart from '../Screens/Cart/Cart';
import CheckoutNavigator from './CheckoutNavigator';

const Stack = createStackNavigator();

function MyStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Cart"
                component={Cart}
                options={{
                    headerShown: false // Hide header for the Cart screen
                }}
            />
            <Stack.Screen 
                name="Checkout"
                component={CheckoutNavigator}
                options={{
                    headerShown: false // Hide header for the Checkout screen
                }}
            />
        </Stack.Navigator>
    )
}

export default function CartNavigator() {
    return <MyStack />
}
