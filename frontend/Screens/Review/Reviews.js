import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity
} from "react-native";
import { Box } from "native-base";
import { DataTable, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native"

import baseURL from "../../assets/common/baseurl"
import EasyButton from "../../Shared/StyledComponents/EasyButton";

const Reviews = (props) => {

    const [reviewList, setReviewList] = useState([]);
    const [reviewFilter, setReviewFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const navigation = useNavigation()

    const searchReview = (text) => {
        if (text === "") {
            setReviewFilter(reviewList)
        }
        setReviewFilter(
            reviewList.filter((i) =>
                i.review.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deleteReview = (id) => {
        axios
            .delete(`${baseURL}reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const reviews = reviewFilter.filter((item) => item.id !== id)
                setReviewFilter(reviews)

                onRefresh()
            })
            .catch((error) => console.log(error));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}reviews`)
                .then((res) => {
                    // console.log(res.data)
                    setReviewList(res.data);
                    setReviewFilter(res.data);
                    setLoading(false);
                })
            setRefreshing(false);
        }, 2000);
    }, []);
    
    useFocusEffect(
        useCallback(
            () => {
                // Get Token
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))
                axios
                    .get(`${baseURL}reviews`)
                    .then((res) => {
                        console.log(res.data)
                        setReviewList(res.data);
                        setReviewFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setReviewList();
                    setReviewFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const handleRowPress = (review) => {
        setSelectedReview(review);
        setModalVisible(true);
    };

    return (
        <Box flex={1}>
            <View style={styles.buttonContainer}>
                
                <EasyButton
                    secondary
                    medium
                    onPress={() => navigation.navigate("ReviewForm")}
                >
                    <Icon name="plus" size={18} color="white" />
                    <Text style={styles.buttonText}> ADD</Text>
                </EasyButton>
            </View>

            <Searchbar width="80%"
                placeholder="Search Review Name"
                onChangeText={(text) => searchReview(text)}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor="#E8E8E8"
                            onPress={() => {
                                setModalVisible(false)
                            }}
                            style={{
                                alignSelf: "flex-end",
                                position: "absolute",
                                top: 5,
                                right: 10
                            }}
                        >
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        {selectedReview && (
                            <>
                                <Text>{selectedReview.name}</Text>
                                <EasyButton
                                    medium
                                    secondary
                                    onPress={() => {
                                        navigation.navigate("ReviewForm", { item: selectedReview });
                                        setModalVisible(false);
                                    }}
                                    title="Edit"
                                >
                                    <Text style={styles.textStyle}>EDIT</Text>
                                </EasyButton>
                                <EasyButton
                                    medium
                                    danger
                                    onPress={() => {
                                        deleteReview(selectedReview.id);
                                        setModalVisible(false);
                                    }}
                                    title="Delete"
                                >
                                    <Text style={styles.textStyle}>DELETE</Text>
                                </EasyButton>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>REVIEW</DataTable.Title>
                        <DataTable.Title>RATING</DataTable.Title>
                        <DataTable.Title>IMAGES</DataTable.Title>
                    </DataTable.Header>
                    {reviewFilter.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleRowPress(item)}
                            style={[styles.container, {
                                backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
                            }]}
                            >
                                <DataTable.Row>
                                    <DataTable.Cell>{item.review}</DataTable.Cell>
                                    <DataTable.Cell>{item.rating}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.image.map((imageUrl, idx) => (
                                            <Image
                                                key={idx}
                                                source={{
                                                    uri: imageUrl ? imageUrl : null
                                                }}
                                                resizeMode="contain"
                                                style={styles.image}
                                                onError={() => console.log("Error loading image")}
                                            />
                                        ))}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </TouchableOpacity>
                        ))}
                    </DataTable>
                )}
            </Box>
        );
    }
    
    const styles = StyleSheet.create({
        spinner: {
            height: height / 2,
            alignItems: 'center',
            justifyContent: 'center'
        },
        container: {
            marginBottom: 160,
            backgroundColor: 'white'
        },
        buttonContainer: {
            margin: 20,
            alignSelf: 'center',
            flexDirection: 'row'
        },
        buttonText: {
            marginLeft: 4,
            color: 'white'
        },
        image: {
            width: 50,
            height: 50,
            marginRight: 5,
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
    });
    
export default Reviews;