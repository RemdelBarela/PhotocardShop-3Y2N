import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"

import baseURL from "../../assets/common/baseurl"
import AuthGlobal from "../../Context/Store/AuthGlobal"

const Shipped = (props) => {
    const context = useContext(AuthGlobal)
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()
    const [userProfile, setUserProfile] = useState('')

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false ||
                context.stateUser.isAuthenticated === null
            ) {
                navigation.navigate("Login")
            }
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))
            axios
                .get(`${baseURL}orders`)
                .then((x) => {
                    const data = x.data;
                    const userOrders = data.filter(
                        (order) =>
                            order.user ? (order.user._id === context.stateUser.user.userId) : false
                    );
                    const pendingOrders = userOrders.filter(order => order.status === "Shipped");
                    setOrders(pendingOrders);
                    console.log('O:', orders)
                })
                .catch((error) => console.log(error))
            return () => {
                setUserProfile();
                setOrders()
            }

        }, [context.stateUser.isAuthenticated]));

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.orderContainer}>
                    <View>
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <View key={order.id} style={[styles.listContainer]}>
                                    <TouchableOpacity                     
                                        onPress={() => navigation.navigate('SingleOrder', { orderId: order._id })}
                                        >
                                        <View style={styles.orderInfo}>
                                            <Text style={styles.orderNumber}>ORDER NUMBER: #{order.id}</Text>
                                            <Text>PHONE NUMBER: {order.phone}</Text>
                                            <Text>ADDRESS: {order.street} {order.barangay}, {order.city}, {order.country} {order.zip}</Text>
                                            <Text>DATE ORDERED: {order.dateOrdered.split("T")[0]}</Text>
                                            <View style={styles.priceContainer}>
                                                <Text style={styles.price}>₱ {order.totalPrice}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noOrderContainer}>
                                <Text style={styles.noOrderText}>YOU HAVE NO ORDERS</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    orderContainer: {
        alignItems: "center",
    },

    noOrderContainer: {
        alignItems: "center",
        marginTop: 20    
    },
    noOrderText: {
        fontSize: 30,
        color: "#555",
        textAlign: "center",
    },
    listContainer: {
        padding: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,

        borderRadius: 10,
        backgroundColor: 'gainsboro',

      },
      
      orderInfo: {
        marginBottom: 10,
      },
      orderNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
      },
      priceContainer: {
        marginTop: 10,
        alignSelf: "flex-end",
        flexDirection: "row",
      },
      price: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
      },
})

export default Shipped;
