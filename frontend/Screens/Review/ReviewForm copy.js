import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
} from "react-native";
import Carousel from 'react-native-snap-carousel';
import { DataTable } from "react-native-paper";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import StarRating from "../../Shared/StarRating";

import baseURL from "../../assets/common/baseurl";
import Error from "../../Shared/Error";

import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");


const ReviewForm = () => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    let navigation = useNavigation();
    let route = useRoute();

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    // const fetchOrderDetails = async () => {
    //     try {
    //         const response = await axios.get(`${baseURL}orders/${route.params.orderId}`);
    //         setOrder(response.data.order);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error fetching order details:", error);
    //         setError('Error fetching order details');
    //         setLoading(false);
    //     }
    // };

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}orders/${route.params.orderId}`);
            setOrder(response.data.order);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError('Error fetching order details');
            setLoading(false);
        }
    };

    const toggleModal = (orderItem) => {
        
        console.log('orderItem: ', orderItem)
        setIsModalVisible(!isModalVisible);
        axios.get(`${baseURL}reviews/order-item/${orderItem}`)
            .then((res) => {
                setSelectedItem(res.data)
                console.log('Additional details for selected orderItem:', res.data);
            })
            .catch((error) => {
                console.log('Error fetching additional details for selected orderItem:', error);
            });
    };

    

    const addReview = (orderItemID) => {

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

        axios.post(`${baseURL}reviews/new/${orderItemID}`, reviewData, config)
        .then((res) => {
            console.log('Response:', res);
            if (res.status === 200 || res.status === 201) {
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "REVIEW ADDED",
                    text2: ""
                });
                setTimeout(() => {
                    navigation.navigate("User Profile");
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

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <FormContainer>
            <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={styles.heading}>ORDER ID: {order._id}</Text>
                    {order.orderItems.map((orderItem, index) => (
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
                                <TouchableOpacity onPress={() => toggleModal(orderItem._id)}>
                                        <Text style={styles.heading}>
                                            {orderItem.hasReview ? "UPDATE REVIEW" : "MAKE REVIEW"}
                                        </Text>
                                    </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {selectedItem && (
                    <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                    <BlurView
                        style={styles.blur}
                        tint="dark"
                        intensity={50}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.heading}>MAKE REVIEW</Text>
                            <Carousel
                                data={selectedItem.photocard.photo.image}
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
                            <View style={styles.orderSummary}>
                                <Text style={styles.heading}>{selectedItem.photocard.photo.name}</Text>
                                <Text style={styles.summaryText}>MATERIAL: {selectedItem.photocard.material.name}</Text>
                            </View>
                            <Input
                                placeholder="Enter your comment"
                                value={comment}
                                onChangeText={text => setComment(text)} // Update the comment state here
                                style={{ color: 'black' }}
                            />
                            
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingLabel}>Rating:</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={parseInt(rating) || 0}
                                    onChangeRating={newRating => setRating(newRating.toString())}
                                />
                            </View>
                            <EasyButton
                                large
                                secondary
                                primary={false}
                                style={styles.blackButton}
                                onPress={() => addReview(selectedItem?._id)}
                            >
                                <Text style={styles.buttonText}>CONFIRM</Text>
                            </EasyButton>
                        </View>
                    </BlurView>
                    </Modal>
                    )}
                    {error ? <Error message={error} /> : null}
                </View>
                    <Text style={styles.footer}>TOTAL PRICE: ₱{order.totalPrice}</Text>
                            {order.status === 'Shipped' && (
                                <TouchableOpacity
                                onPress={() => handleStatus(order._id)}
                                style={[styles.orderStatus, { backgroundColor: 'black' }]}
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
        </FormContainer>
    );
};

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

    itemContainer: {
        padding: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: 'gainsboro',
    },

    itemBox: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 5,
    },
    productInfo: {
        marginBottom: 20,
    },
    reviewSection: {
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingLabel: {
        marginRight: 10,
        fontSize: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 5,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        width: Dimensions.get('window').width - 40,
        maxHeight: Dimensions.get('window').height - 100, // Adjust height as needed
        borderRadius: 10,
        alignSelf: 'center',
    },
    blur: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    orderItemHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20
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
        backgroundColor: 'black',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        height: 45,
    },
    footer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        backgroundColor: 'gainsboro',
        textAlign: 'center',
        padding: 20
    },
});

export default ReviewForm;
