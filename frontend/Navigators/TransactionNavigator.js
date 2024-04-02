import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

// Screens
import Pending from '../Screens/Order/Pending'
import Shipped from '../Screens/Order/Shipped'
import Completed from '../Screens/Order/Completed'
import Review from '../Screens/Order/Review'

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
    return(
        <Tab.Navigator>
            <Tab.Screen name="PENDING" component={Pending} />
            <Tab.Screen name="SHIPPED" component={Shipped} />
            <Tab.Screen name="COMPLETED" component={Completed} />
            <Tab.Screen name="REVIEW" component={Review} />
        </Tab.Navigator>
    );
}

export default function TransactionNavigator() {
    return <MyTabs />
}