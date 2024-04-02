import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Orders from "../Screens/Admin/Order/OrderTable"
import SingleAdminOrder from "../Screens/Admin/Order/SingleOrder"

const Stack = createStackNavigator();

const PhotoNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Orders"
                component={Orders}
                options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }}
            />
            <Stack.Screen 
            name="SingleAdminOrder"   
            component={SingleAdminOrder}    
            options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }} />

        </Stack.Navigator>
    )
}
export default  PhotoNavigator