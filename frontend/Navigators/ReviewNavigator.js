import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Review from "../Screens/Review/Reviews"
import ReviewForm from "../Screens/Review/ReviewForm"

const Stack = createStackNavigator();

const PhotoNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Review"
                component={Review}
            />
            <Stack.Screen name="ReviewForm" component={ReviewForm} />

        </Stack.Navigator>
    )
}
export default  PhotoNavigator