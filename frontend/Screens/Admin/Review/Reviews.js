import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Box } from "native-base";
import { DataTable, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native"
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

import DisableStar from "../../../Shared/DisabledStar"
import baseURL from "../../../assets/common/baseurl"

const Reviews = (props) => {

    const [reviewList, setReviewList] = useState([]);
    const [reviewFilter, setReviewFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const navigation = useNavigation()

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
                    .get(`${baseURL}reviews/`)
                    .then((res) => {
                        setReviewList(res.data);
                        console.log(res.data)

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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}photos`)
                .then((res) => {
                    // console.log(res.data)
                    setPhotoList(res.data);
                    setPhotoFilter(res.data);
                    setLoading(false);
                })
            setRefreshing(false);
        }, 2000);
    }, []);

    const deleteReview = (id) => {
        AsyncStorage.getItem("jwt")
        .then((res) => {
            setToken(res)
        })
        .catch((error) => console.log(error))
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Corrected to include Authorization header in the headers object
            }
        };
        axios
            .delete(`${baseURL}reviews/${id}`, config)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "REVIEW IS DELETED SUCCESSFULLY",
                        text2: ""
                    });
                    setTimeout(() => {
                        navigation.navigate("REVIEWS");
                    }, 500)
                    onRefresh()

                    
                }
            })
            .catch((error) => {
                console.log(error)
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "ERROR!",
                    text2: "PLEASE TRY AGAIN"
                })
            });
    }

    return (
        <Box flex={1}>
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (
                <DataTable>
                    <DataTable.Header style={{ backgroundColor: 'black' }}>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }} ><Text style={{ color: 'white' }}>REVIEW ID</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>COMMENT</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>RATING</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PHOTO NAME</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>DELETE</Text></DataTable.Title>
                    </DataTable.Header>
                    {reviewList.map((item, index) => {
                        console.log('reviewlist: ', item)
                        return(
                        
                            <DataTable.Row>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item._id}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.comment}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.rating}  
                                    <Icon
                                        name="star"
                                        size={20}
                                        color="black"
                                    />
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.orderItem.photocard.photo.name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <EasyButton
                                    onPress={() => deleteReview(item._id)}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? 'lightgray' : 'gainsboro',
                                    }} />
                                        <Icon name="trash" size={18} color="white" backgroundColor="black" />
                                    </DataTable.Cell>
                            </DataTable.Row>
                       
                    )})}

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
    }, header: {
        fontSize: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
});

export default Reviews;
