import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Orders from "../Screens/Admin/Orders"
import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"
import Photos from "../Screens/Admin/Photo/Photos"
import Categories from "../Screens/Admin/Categories"
import Materials from "../Screens/Admin/Material/Materials"
import Users from "../Screens/Admin/Users"

const Stack = createStackNavigator();

const AdminNavigator= () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Products"
                component={Products}
                options={{
                    title: "Products"
                }}
            />
            <Stack.Screen 
                name="Photos"
                component={Photos}
                options={{
                    title: "Photos"
                }}
            />
            <Stack.Screen 
                name="Materials"
                component={Materials}
                options={{
                    title: "Materials"
                }}
            />
             <Stack.Screen 
                name="Users"
                component={Users}
                options={{
                    title: "Users"
                }}
            />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="ProductForm" component={ProductForm} />
        </Stack.Navigator>
    )
}
export default AdminNavigator