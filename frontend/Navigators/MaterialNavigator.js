import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Materials from "../Screens/Admin/Material/Materials"
import MaterialForm from "../Screens/Admin/Material/MaterialForm"

const Stack = createStackNavigator();

const MaterialNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Materials"
                component={Materials}
                options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }}
            />
            <Stack.Screen name="MaterialForm"      options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }} component={MaterialForm} />

        </Stack.Navigator>
    )
}
export default  MaterialNavigator