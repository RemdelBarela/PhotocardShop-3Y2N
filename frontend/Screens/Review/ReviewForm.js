import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
} from "react-native";
import { DataTable } from "react-native-paper";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import baseURL from "../../assets/common/baseurl";
import Error from "../../Shared/Error";

import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute  } from "@react-navigation/native";
import mime from "mime";
import StarRating from "../../Shared/StarRating";

const ReviewForm = (props) => {
    const [comments, setComments] = useState({});
    const [ratings, setRatings] = useState({});
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

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
            const initialComments = {};
            const initialRatings = {};
            response.data.order.orderItems.forEach(item => {
                initialComments[item._id] = '';
                initialRatings[item._id] = '';
            });
            setComments(initialComments);
            setRatings(initialRatings);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError('Error fetching order details');
            setLoading(false);
        }
    };

    const addReview = () => {
        const promises = [];
        for (const itemId in comments) {
            const comment = comments[itemId];
            const rating = ratings[itemId];
            const formData = new FormData();
            formData.append("comment", comment);
            formData.append("rating", rating);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            };
            const promise = axios.post(`${baseURL}reviews/new`, formData, config);
            promises.push(promise);
        }
        Promise.all(promises)
            .then(() => {
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Reviews added successfully",
                    text2: ""
                });
                setTimeout(() => {
                    navigation.navigate("User Profile");
                }, 500);
            })
            .catch(error => {
                console.error("Error adding reviews:", error);
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again"
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
                                <Text style={styles.heading}>ORDERED ITEM</Text>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title>Product</DataTable.Title>
                                        <DataTable.Title>Image</DataTable.Title>
                                        <DataTable.Title>Material</DataTable.Title>
                                        <DataTable.Title>Quantity</DataTable.Title>
                                    </DataTable.Header>
                                    <DataTable.Row>
                                        <DataTable.Cell>{item.photocard.photo.name}</DataTable.Cell>
                                        <DataTable.Cell>{item.photocard.photo.image}</DataTable.Cell>
                                        <DataTable.Cell>{item.photocard.material.name}</DataTable.Cell>
                                        <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                    </DataTable.Row>
                                </DataTable>
                            </View>
                            <View style={styles.reviewSection}>
                                <Text style={styles.heading}>MAKE REVIEW</Text>
                                <Input
                                    placeholder="Enter your comment"
                                    value={comments[item._id]}
                                    onChangeText={text => setComments({...comments, [item._id]: text})}
                                    style={{ color: 'black' }} 
                                />
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.ratingLabel}>Rating:</Text>
                                    <StarRating
                                        maxStars={5}
                                        rating={parseInt(ratings[item._id])}
                                        onChangeRating={newRating => setRatings({...ratings, [item._id]: newRating.toString()})}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                {error ? <Error message={error} /> : null}
                <View style={styles.buttonContainer}>
                    <EasyButton
                        large
                        secondary
                        primary={false}
                        style={styles.blackButton}
                        onPress={() => addReview()}
                    >
                        <Text style={styles.buttonText}>CONFIRM</Text>
                    </EasyButton>
                </View>
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
    buttonContainer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    blackButton: {
        backgroundColor: "black",
    },
    buttonText: {
        color: "white",
    },
});

export default ReviewForm;
