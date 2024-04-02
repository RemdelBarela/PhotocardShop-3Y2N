import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker, Select } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { useNavigation } from '@react-navigation/native'

const codes = [
  { name: "pending", code: "3" },
  { name: "shipped", code: "2" },
  { name: "delivered", code: "1" },
];

const OrderCard = ({ item, select }) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState('');
  const [statusChange, setStatusChange] = useState('');
  const [token, setToken] = useState('');
  const [cardColor, setCardColor] = useState('');
  const navigation = useNavigation()

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const updateOrder = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const order = {
      city: item.city,
      country: item.country,
      dateOrdered: item.dateOrdered,
      id: item.id,
      orderItems: item.orderItems,
      phone: item.phone,
      shippingAddress1: item.shippingAddress1,
      shippingAddress2: item.shippingAddress2,
      status: statusChange,
      totalPrice: item.totalPrice,
      user: item.user,
      zip: item.zip,
    };
    axios
      .put(`${baseURL}orders/${item.id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Edited",
            text2: "",
          });
          setTimeout(() => {
            navigation.navigate("Products");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  }

  useEffect(() => {
    if (item.status === "3") {
      setOrderStatus(<TrafficLight unavailable />);
      setStatusText("Pending");
      setCardColor("#f0f0f0"); // Gray background
    } else if (item.status === "2") {
      setOrderStatus(<TrafficLight limited />);
      setStatusText("Shipped");
      setCardColor("#f0f0f0"); // Gray background
    } else {
      setOrderStatus(<TrafficLight available />);
      setCardColor("#f0f0f0"); // Gray background
    }

    return () => {
      setOrderStatus(null);
      setStatusText('');
      setCardColor('');
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>Order Number:</Text>
        <Text style={styles.orderNumberValue}>#{item.id}</Text>
        <Text>
          Status: {statusText} {orderStatus}
        </Text>
        <Text>
          Address: {item.shippingAddress1} or {item.shippingAddress2}
        </Text>
        <Text>City: {item.city}</Text>
        <Text>Country: {item.country}</Text>
        <Text>Date Ordered: {item.dateOrdered.split("T")[0]}</Text>
        <View style={styles.priceContainer}>
          <Text>Price: </Text>
          <Text style={styles.price}>₱<Text style={{ textDecorationLine: 'underline' }}>{item.totalPrice}</Text></Text>
        </View>
      </View>
      {!select &&
        <View style={styles.buttonContainer}>
          <Select
            width="80%"
            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
            style={{ width: undefined }}
            selectedValue={statusChange}
            color="black"
            placeholder="Change Status"
            placeholderTextColor="black"
            placeholderStyle={{ color: '#FFFFFF' }}
            placeholderIconColor="#007aff"
            onValueChange={(e) => setStatusChange(e)}
          >
            {codes.map((c) => (
              <Select.Item
                key={c.code}
                label={c.name}
                value={c.code}
              />
            ))}
          </Select>
          <EasyButton
            secondary
            large
            style={styles.updateButton} // Changed to gray
            onPress={updateOrder}
          >
            <Text style={styles.buttonText}>Update</Text>
          </EasyButton>
        </View>
      }
      <View style={styles.buttonContainer}>
        <EasyButton
          secondary
          large
          style={styles.reviewButton} // Styled as black
          onPress={() => navigation.navigate('Review Form', { orderId: item.id })}
        >
          <Text style={styles.buttonText}>Review Order</Text>
        </EasyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  orderInfo: {
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderNumberValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "black",
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#888",
  },
  reviewButton: {
    backgroundColor: "black",
  },
});

export default OrderCard;