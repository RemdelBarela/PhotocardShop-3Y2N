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
            />
            <Stack.Screen name="MaterialForm" component={MaterialForm} />

        </Stack.Navigator>
    )
}
export default  MaterialNavigator