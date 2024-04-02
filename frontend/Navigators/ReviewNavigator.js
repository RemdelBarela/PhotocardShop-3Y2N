import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Review from "../Screens/Review/Reviews"
import ReviewForm from "../Screens/Review/ReviewForm"

const Stack = createStackNavigator();

const ReviewNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Review"
                component={Review}
                options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }}
            />
            <Stack.Screen name="ReviewForm"      options={{
                    tabBarLabel: '', // Hide the name from the tab
                    headerShown: false // Hide header for the Cart screen
                   }}component={ReviewForm} />

        </Stack.Navigator>
    )
}
export default  ReviewNavigator