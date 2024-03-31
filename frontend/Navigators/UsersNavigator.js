import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Users from "../Screens/Admin/Users"
import Register from "../Screens/User/Register"
// import UpdateProfile from "../Screens/User/UpdateProfile"
// import UpdateUser from "../Screens/Admin/UpdateUser"

const Stack = createStackNavigator();

const UsersNavigator= () => {
    
    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Users"
                component={Users}
                options={{
                      tabBarLabel: '', // Hide the name from the tab
                      headerShown: false // Hide header for the Cart screen
                     }}
            />
            <Stack.Screen name="Register" component={Register} />
            {/* <Stack.Screen name="UpdateProfile" component={UpdateProfile} /> */}
            {/* <Stack.Screen name="UpdateUser" component={UpdateUser} /> */}
        </Stack.Navigator>
        
    )
}

export default UsersNavigator