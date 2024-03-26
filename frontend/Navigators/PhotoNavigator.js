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
            />
            <Stack.Screen name="PhotoForm" component={PhotoForm} />

        </Stack.Navigator>
    )
}
export default  PhotoNavigator