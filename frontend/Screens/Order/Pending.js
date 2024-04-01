import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseurl"
import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"
import OrderCard from './OrderCard';

const UserProfile = (props) => {
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState('')
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()

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
                    setOrders(userOrders);
                })
                .catch((error) => console.log(error))
            return () => {
                setUserProfile();
                setOrders()
            }

        }, [context.stateUser.isAuthenticated]))

    const handleUpdateProfile = () => {
        console.log("UserProfile:", userProfile);
        navigation.navigate("Update Profile", { user: userProfile });
    };

    const handleSignOut = () => {
        AsyncStorage.removeItem("jwt");
        logoutUser(context.dispatch);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.orderContainer}>
                <Text style={styles.orderHeader}>MY ORDERS</Text>
                <View>
                    {orders ? (
                        orders.map((order) => {
                            return <OrderCard key={order.id} item={order} select={false} />;
                        })
                    ) : (
                        <View style={styles.noOrderContainer}>
                            <Text style={styles.noOrderText}>YOU HAVE NO ORDERS</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    userInfoContainer: {
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 20,
        alignItems: "center",
    },
    userInfoText: {
        marginVertical: 10,
        fontSize: 16,
        color: "#555",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    orderContainer: {
        alignItems: "center",
    },
    orderHeader: {
        fontSize: 20,
        marginBottom: 3,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    noOrderContainer: {
        alignItems: "center",
    },
    noOrderText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
    },
})

export default UserProfile;
