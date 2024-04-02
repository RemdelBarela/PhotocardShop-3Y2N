import React, { useCallback, useState, useEffect } from "react";
import { View, Text, FlatList } from 'react-native'
import axios from 'axios'
import baseURL from "../../assets/common/baseurl";
import { useFocusEffect } from '@react-navigation/native'
import OrderCard from "../Order/OrderCard";

const Orders = (props) => {
    const [orderList, setOrderList] = useState();
    const [photoMaterialOrders, setPhotoMaterialOrders] = useState([]);

    useEffect(() => {
        getOrders();
        getPhotoMaterialOrders();
    }, []);

    const getOrders = () => {
        axios.get(`${baseURL}orders`)
            .then((response) => {
                setOrderList(response.data);
            })
            .catch((error) => console.log(error));
    };

    const getPhotoMaterialOrders = () => {
        axios.get(`${baseURL}orders/get/photoMaterialOrders`)
            .then((response) => {
                setPhotoMaterialOrders(response.data);
            })
            .catch((error) => console.log(error));
    };

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Orders</Text>
            <FlatList
                data={orderList}
                renderItem={({ item }) => (
                    <OrderCard item={item} />
                )}
                keyExtractor={(item) => item.id}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Total Orders for Each Photo and Material:</Text>
            {photoMaterialOrders.map((item) => (
                <View key={item._id}>
                    <Text>Photo: {item.photoName}, Material: {item.materialName}, Total Orders: {item.totalOrders}</Text>
                </View>
            ))}
        </View>
    )
}

export default Orders;