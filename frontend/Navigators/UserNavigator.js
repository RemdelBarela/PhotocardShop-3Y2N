import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
import UpdateProfile from "../Screens/User/UpdateProfile";
import ReviewForm from "../Screens/Review/ReviewForm";
import SingleOrder from "../Screens/Order/SingleOrder";
import Transaction from "./TransactionNavigator";
import Reviews from "../Screens/Review/Reviews"

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />
           <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#CCCCCC' }  
                }}
            />
             <Stack.Screen
                name="Update Profile"
                component={UpdateProfile}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#CCCCCC' } // Set background color here
   
                }}
            />
            <Stack.Screen
                name="Transaction"
                component={Transaction}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#CCCCCC' } // Set background color here
   
                }}
            />
             <Stack.Screen
                name="SingleOrder"
                component={SingleOrder}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#CCCCCC' } // Set background color here
   
                }}
            />
            <Stack.Screen
                name="Review Form"
                component={ReviewForm}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Reviews"
                component={Reviews}
                options={{
                    headerShown: false
                }}
            />     
        </Stack.Navigator>
    )
}
export default UserNavigator;