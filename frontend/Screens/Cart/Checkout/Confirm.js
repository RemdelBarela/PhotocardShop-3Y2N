import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, Button, Image } from "react-native";
import { Text } from "native-base";
import Carousel from 'react-native-snap-carousel';
import { DataTable } from "react-native-paper";
import { clearCart } from "../../../Redux/Actions/cartActions";
import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from "@react-native-async-storage/async-storage"


var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
    const [token, setToken] = useState();

    const finalOrder = props.route.params;
    console.log("order", finalOrder)
    const dispatch = useDispatch()
    let navigation = useNavigation()

    const confirmOrder = () => {
        const order = finalOrder.order.order;

        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)

            })
            .catch((error) => console.log(error))
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios
            .post(`${baseURL}orders`, order, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "ORDER COMPLETED",
                        text2: "",
                    });
                    // dispatch(clearCart())
                    // navigation.navigate("Cart")

                    setTimeout(() => {
                        dispatch(clearCart())
                        navigation.navigate("Cart");
                    }, 500);
                }
            })
            .catch((error) => {
                console.log(error)
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "ERROR!",
                    text2: "PLEASE TRY AGAIN",
                });
            });
    }
    return (

        <ScrollView style={styles.container}>
        <View>
            {props.route.params ? (
                <View style={{ borderWidth: 1, borderColor: "black" }}>
                    <View style={styles.orderInfo}>
                        <Text>PHONE NUMBER: {finalOrder.order.order.phone}</Text>
                        <Text>ADDRESS: {finalOrder.order.order.street} {finalOrder.order.order.barangay}, {finalOrder.order.order.city}, {finalOrder.order.order.country} {finalOrder.order.order.zip}</Text>
                    </View>
                    <Text style={styles.orderItemHeading}>ORDER ITEMS:</Text>
    
                    {finalOrder.order.order.orderItems.map((item, index) => {
                        console.log(item)
                        const photoImage = item.newData.photo.image;
                        const photoName = item.newData.photo.name;
                        const materialName = item.newData.material.name;
                        const materialPrice = item.newData.material.price;
                        const quantityNum = item.quantity;
    
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <Carousel
                                    data={photoImage}
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
                                    <DataTable.Header style={styles.tableHeader}>
                                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PHOTO</Text></DataTable.Title>
                                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>MATERIAL</Text></DataTable.Title>
                                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>QUANTITY</Text></DataTable.Title>
                                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PRICE</Text></DataTable.Title>
                                    </DataTable.Header>
                                    <DataTable.Row>
                                        <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{photoName}</DataTable.Cell>
                                        <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{materialName}</DataTable.Cell>
                                        <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{quantityNum}</DataTable.Cell>
                                        <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{materialPrice}</DataTable.Cell>
                                    </DataTable.Row>
                                </DataTable>
                            </View>
                        )
                    })}
                </View>
            ) : null}
            <View style={{ alignItems: "center", margin: 20 }}>
                <Button
                    title={"Place order"}
                    onPress={confirmOrder}
                />
            </View>
        </View>
    </ScrollView>
    

    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        margin: 10
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
    orderItemHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20
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
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'white',
    },
    priceContainer: {
        marginTop: 10,
        alignSelf: "flex-end",
        flexDirection: "row",
    },
});
export default Confirm;