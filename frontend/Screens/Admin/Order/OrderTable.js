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

import baseURL from "../../../assets/common/baseurl"

const OrderTable = (props) => {

    const [orderList, setOrderList] = useState([]);
    const [orderFilter, setOrderFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation()

    const searchOrder = (text) => {
        if (text === "") {
            setOrderFilter(orderList)
        }
        setOrderFilter(
            orderList.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

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
                    .get(`${baseURL}orders/admin`)
                    .then((res) => {
                        setOrderList(res.data);
                        // setOrderFilter(res.data.orderList);
                        console.log(res.data)

                        setLoading(false);
                    })

                return () => {
                    setOrderList();
                    setOrderFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const handleRowPress = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
    };

    return (
        <Box flex={1}>
            <View style={styles.buttonContainer}>
                <Searchbar
                    placeholder="Search Order Name"
                    onChangeText={(text) => searchOrder(text)}
                    style={{ flex: 1 }} // Allow the search bar to take remaining space
                />

            </View>

            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (
                <DataTable>
                    <DataTable.Header style={{ backgroundColor: 'black' }}>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }} ><Text style={{ color: 'white' }}>ORDER ID</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>TOTAL PRICE</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>STATUS</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>DATE</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>VIEW</Text></DataTable.Title>
                    </DataTable.Header>
                    {orderList.map((item, index) => {
                        console.log('orderlist: ', item)
                        return(
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate('SingleAdminOrder', { orderId: item._id })}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'lightgray' : 'gainsboro',
                            }}>
                            <DataTable.Row>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item._id}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.totalPrice}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.status}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {item.dateOrdered}
                                </DataTable.Cell>
                                <DataTable.Cell
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 10,
                                        backgroundColor: 'black',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 20 // Half of width or height to make it circular
                                    }}>
                                    <Icon name="eye" size={18} color="white" />
                                </DataTable.Cell>
                            </DataTable.Row>
                        </TouchableOpacity>
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

export default OrderTable;
