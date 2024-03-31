import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Image } from 'react-native';
import { Container } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseurl"
import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"
import OrderCard from '../../Shared/OrderCard';

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
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <View style={styles.userInfoContainer}>
                    {userProfile && userProfile.image &&
                        <Image style={styles.profileImage} source={{ uri: userProfile.image }} />
                    }
                    <Text style={styles.header}>
                        {userProfile ? userProfile.name : ""}
                    </Text>
                    <Text style={styles.userInfoText}>
                        Email: {userProfile ? userProfile.email : ""}
                    </Text>
                    <Text style={styles.userInfoText}>
                        Phone: {userProfile ? userProfile.phone : ""}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                <View style={styles.button}>
                <View style={styles.topButton}>
                    <Button
                    title="Update Profile"
                    onPress={handleUpdateProfile}
                    color="#888"
                    />
                </View>
                <View style={styles.bottomButton}>
                    <Button
                    title="Sign Out"
                    onPress={handleSignOut}
                    color="black"
                    />
                </View>
                </View>
                </View>
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
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        width: "100%"
    },
    subContainer: {
        alignItems: "center"
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
        justifyContent: "space-between",
        marginBottom: 30, 
        marginHorizontal: "5%",
        width: "80%"
    },
    orderContainer: {
        alignItems: "center",
    },
    orderHeader: {
        fontSize: 20,
        marginBottom:3,
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
    buttonContainer: {
        flexDirection: "column",
        marginBottom: 30,
        marginHorizontal: "5%",
        width: "80%",
      },
      topButton: {
        marginBottom: 15,
      },
      bottomButton: {
        marginBottom: 10,
      },
})

export default UserProfile;