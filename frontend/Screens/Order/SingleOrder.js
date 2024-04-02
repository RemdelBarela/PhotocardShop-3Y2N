import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import Carousel from 'react-native-snap-carousel';
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

import baseURL from "../../assets/common/baseurl"

const SingleOrder = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState();

    const [order, setOrder] = useState([])

    let navigation = useNavigation();
    let route = useRoute();

    const { orderId } = route.params;

    console.log ('ORDER ID: ',orderId)


    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}orders/${orderId}`);
            setOrder(response.data.order);
            console.log ('ORDERS: ', response.data.order)

            setLoading(false);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError('Error fetching order details');
            setLoading(false);
        }
    };

    const handleStatus = (id) => {

        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                setToken(token);
            } catch (error) {
                console.log(error);
            }
        };
        
        getToken();
        
        console.log('tokenss: ', token)

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        axios.put(`${baseURL}orders/status/${id}`, config)
        .then((res) => {
            console.log('Response:', res);
            if (res.status === 200 || res.status === 201) {
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "ORDER RECEIVED",
                    text2: ""
                });
                setTimeout(() => {
                    navigation.navigate("REVIEW");
                    console.log('Navigation complete');
                }, 500);

                fetchOrderDetails()
            } else {
                console.log('Unexpected response status:', res.status);
            }
        })
        .catch((error) => {
            console.log('Error config:', error.config);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "ERROR!",
                text2: "PLEASE TRY AGAIN"
            });
        });
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
            <View>
                <Text style={styles.heading}>ORDER ID: {order._id}</Text>
                    {order.orderItems ? (
                            order.orderItems.map((orderItem, index) => (
                                <View key={index} style={styles.itemContainer}>
                                        <View>
                                            <Text style={styles.orderItemHeading}>ORDER ITEM: {orderItem._id}</Text>
                                            <Carousel
                                                data={orderItem.photocard.photo.image}
                                                renderItem={({ item }) => (
                                                    <Image
                                                        source={{ uri: item }}
                                                        resizeMode="contain"
                                                        style={styles.image}
                                                    />
                                                )}
                                                sliderWidth={width}
                                                itemWidth={width * 0.8}
                                                loop={true}
                                                autoplay={true}
                                                autoplayInterval={5000}
                                            />
                                            <DataTable style={styles.dataTableContainer}>
                                                <DataTable.Header  style={styles.tableHeader}>
                                                    <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PHOTO</Text></DataTable.Title>
                                                    <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>MATERIAL</Text></DataTable.Title>
                                                    <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>QUANTITY</Text></DataTable.Title>
                                                    <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PRICE</Text></DataTable.Title>
                                                </DataTable.Header>
                                                <DataTable.Row>
                                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{orderItem.photocard.photo.name}</DataTable.Cell>
                                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{orderItem.photocard.material.name}</DataTable.Cell>
                                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{orderItem.quantity}</DataTable.Cell>
                                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{orderItem.photocard.material.price}</DataTable.Cell>
                                                </DataTable.Row>
                                            </DataTable>
                                        </View>
                                </View>
                            ))
                            ) : (
                                <View style={styles.noOrderContainer}>
                                <Text style={styles.noOrderText}>YOU HAVE NO ORDERS</Text>
                            </View>
                            )}
            </View>
            <Text style={styles.footer}>TOTAL PRICE: ₱{order.totalPrice}</Text>
            {order.status === 'Shipped' && (
                <TouchableOpacity
                onPress={() => handleStatus(order._id)}
                style={[styles.orderStatus, { backgroundColor: 'black' }, order.status === 'Delivered' && { opacity: 0.5 }]}
                disabled={order.status === 'Delivered'} 
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20  }}>RECEIVED ORDER</Text>
            </TouchableOpacity>
            )}
            {order.status === 'Delivered' && (
                <TouchableOpacity
                onPress={() => navigation.navigate('Review Form', { orderId: order._id })}
                style={[styles.orderStatus, { backgroundColor: 'black' }]}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>REVIEW ORDER</Text>
                </TouchableOpacity>
            )}
            </ScrollView>      
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
        backgroundColor: 'gainsboro',
        textAlign: 'center',
        padding: 20
    },

    footer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        backgroundColor: 'gainsboro',
        textAlign: 'center',
        padding: 20
    },

    orderStatus: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20
    },


    orderItemHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20
    },
    
    itemContainer: {
        padding: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: 'gainsboro',
    },

    image: {
        aspectRatio: 5.5 / 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        padding: 10,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 10
    },

    tableHeader: {
        marginTop: 20,
        backgroundColor: 'black',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        height: 45,
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
    
})

export default SingleOrder;
