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

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}orders/${route.params.orderId}`);
            setOrder(response.data.order);
            // Initialize comments and ratings for each product
            // const initialComments = {};
            // const initialRatings = {};
            // response.data.order.orderItems.forEach(item => {
            //     initialComments[item.photocard.photo._id] = '';
            //     initialRatings[item.photocard.photo._id] = '';
            // });
            // setComments(initialComments);
            // setRatings(initialRatings);
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

        let formData = new FormData();
        formData.append("comment", comment);
        formData.append("rating", rating);

        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                setToken(token);
            } catch (error) {
                console.log(error);
            }
        };
        
        getToken();
        
        console.log('form: ', formData)
        console.log('tokenss: ', token)

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        };

        axios.post(`${baseURL}reviews/new/${orderItemID}`, formData, config)
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
                    navigation.navigate("ReviewForm");
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
        <FormContainer title="REVIEW">
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.orderSummary}>
                    <Text style={styles.heading}>ORDER SUMMARY</Text>
                    <Text style={styles.summaryText}>Order ID: {order._id}</Text>
                    <Text style={styles.summaryText}>Total Price: ₱{order.totalPrice.toFixed(2)}</Text>
                </View>
                {order.orderItems.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <View style={styles.itemBox}>
                            <View style={styles.productInfo}>
                                <Text style={styles.heading}>{item.photocard.photo.name}</Text>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title>Material</DataTable.Title>
                                        <DataTable.Title>Quantity</DataTable.Title>
                                    </DataTable.Header>
                                    <DataTable.Row>
                                        <DataTable.Cell>{item.photocard.material.name}</DataTable.Cell>
                                        <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                    </DataTable.Row>
                                </DataTable>
                            </View>
                            <TouchableOpacity onPress={() => toggleModal(item._id)}>
                                <Text style={styles.heading}>MAKE REVIEW</Text>
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
            </ScrollView>
        </FormContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    orderSummary: {
        marginBottom: 20,
        marginTop: 10,
    },
    itemContainer: {
        marginBottom: 30,
    },
    itemBox: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textTransform: 'uppercase'
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
    image: {
        aspectRatio: 5.5 / 8.5,
    },
    
});

export default ReviewForm;
