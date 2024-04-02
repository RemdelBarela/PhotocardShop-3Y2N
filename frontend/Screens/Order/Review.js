import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Carousel from 'react-native-snap-carousel';
import { DataTable } from "react-native-paper";
import Input from "../../Shared/Form/Input";

import axios from "axios"
import baseURL from "../../assets/common/baseurl"
import AuthGlobal from "../../Context/Store/AuthGlobal"
import DisabledStar from "../../Shared/DisabledStar";
import StarRating from "../../Shared/StarRating";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const Pending = (props) => {
    const context = useContext(AuthGlobal)
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()
    const [userProfile, setUserProfile] = useState('')
    const [showReviewUpdate, setShowReviewUpdate] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [error, setError] = useState('');

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
                .get(`${baseURL}orders/filtered`)
                .then(response => {
                    const filteredOrders = response.data;
                    const userOrders = filteredOrders.filter(order => order.user ? order.user._id === context.stateUser.user.userId : false);
                    setOrders(userOrders);
                    console.log('Filtered orders:', userOrders);
                })
                .catch(error => {
                    console.error('Error fetching filtered orders:', error);
                });
            
            return () => {
                setUserProfile();
                setOrders()
            }

        }, [context.stateUser.isAuthenticated]));

        const updateReview = (orderItemID) => {

            if (!comment) {
                setError('YOUR COMMENT IS MISSING');
                return;
            }
    
            const reviewData = {
                comment: comment,
                rating: rating
            };
    
            const getToken = async () => {
                try {
                    const token = await AsyncStorage.getItem("jwt");
                    setToken(token);
                } catch (error) {
                    console.log(error);
                }
            };
            
            getToken();
            
            console.log('reviewData: ', reviewData)
            console.log('tokenss: ', token)
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            axios.put(`${baseURL}reviews/${orderItemID}`, reviewData, config)
            .then((res) => {
                console.log('Response:', res);
                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "REVIEW UPDATED",
                        text2: ""
                    });
                    setTimeout(() => {
                        navigation.navigate("REVIEW");
                        console.log('Navigation complete');
                    }, 500);
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

        const toggleUpdate = () => {
            setShowReviewUpdate(!showReviewUpdate);
        };

        useEffect(() => {
                const firstOrderItemReview = orders[0].orderItems[0].reviews[0];
                if (firstOrderItemReview) {
                    setComment(firstOrderItemReview.comment || '');
                    setRating(firstOrderItemReview.rating || '');
                }
            
        }, [orders]);
        
    return (
        <ScrollView style={styles.container}>
            {orders && orders.length > 0 ? (
                orders.map((order) => (
                    <View key={order.id} style={[styles.listContainer]}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderNumber}>ORDER NUMBER: #{order._id}</Text>
                            <Text>PHONE NUMBER: {order.phone}</Text>
                            <Text>ADDRESS: {order.street} {order.barangay}, {order.city}, {order.country} {order.zip}</Text>
                            <Text>DATE ORDERED: {order.dateOrdered.split("T")[0]}</Text>
                        </View>
                        {order.orderItems.map((orderItem, index) => {
                             console.log('reviews:', orderItem.reviews[0].rating)
                            return(
                            <View key={index} style={styles.itemContainer}>
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
                                <Text style={styles.reviewLabel}>REVIEW:</Text>
                                <Text style={styles.commentLabel}>{orderItem.reviews[0].comment}</Text>

                                <View style={styles.ratingContainer}>
                                    <DisabledStar
                                        maxStars={5}
                                        rating={orderItem.reviews[0].rating} // Set the rating directly
                                        disabled={true} // Make the stars readonly
                                        starSize={20} // Adjust the size of stars as needed
                                        fullStarColor={'pink'} // Customize the color of filled stars
                                        emptyStarColor={'pink'} // Customize the color of empty stars
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => toggleUpdate(orderItem._id)}
                                    style={[styles.orderStatus, { backgroundColor: 'black' }]}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>UPDATE REVIEW</Text>
                                </TouchableOpacity>
                                {showReviewUpdate && (
                                    <View>
                                    <Input
                                        placeholder="Enter your comment"
                                        value={comment}
                                        onChangeText={text => setComment(text)}
                                        />
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.ratingLabel}>RATING:</Text>
                                        <StarRating
                                            maxStars={5}
                                            rating={parseInt(rating) || 0}
                                            onChangeRating={newRating => setRating(newRating.toString())}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => updateReview(orderItem._id, index)} // Pass index as argument
                                        style={[styles.orderStatus, { backgroundColor: 'black' }]}
                                    >
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>ADD REVIEW</Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                            </View>
                        )})}
                    </View>
                ))
            ) : (
                <View style={styles.noOrderContainer}>
                    <Text style={styles.noOrderText}>YOU HAVE NO ORDERS</Text>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        margin: 10
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
        marginBottom: 30,
        borderRadius: 10,
        backgroundColor: 'gainsboro',
    },
    orderInfo: {
        marginBottom: 10,
        padding: 10
    },
    orderNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: 'white',
        textAlign: 'center',
        padding: 20
    },
    reviewLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 20,
    },
    commentLabel: {
        fontSize: 15,
        fontWeight: 'italic',
        textAlign: 'left',
        marginLeft: 5,
        marginTop: 10,

    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'white',
    },
    orderItemHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20
    },
    image: {
        aspectRatio: 5.5 / 8.5,
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
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 20,

    }
});

export default Pending;
