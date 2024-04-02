import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Photos from "../Screens/Admin/Photo/Photos"
import PhotoForm from "../Screens/Admin/Photo/PhotoForm"

const Stack = createStackNavigator();

const PhotoNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Photos"
                component={Photos}
                options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }}
            />
            <Stack.Screen name="PhotoForm"      options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }} component={PhotoForm} />

        </Stack.Navigator>
    )
}
export default  PhotoNavigator