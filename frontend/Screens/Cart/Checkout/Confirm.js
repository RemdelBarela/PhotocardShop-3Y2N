import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import { Text, HStack, VStack, Avatar, Spacer, Center } from 'native-base';
import { clearCart } from '../../../Redux/Actions/cartActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../../assets/common/baseurl';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

var { width, height } = Dimensions.get('window');

const Confirm = (props) => {
  const [token, setToken] = useState();
  const finalOrder = props.route.params ? props.route.params : {}; // Ensure finalOrder is initialized
  const dispatch = useDispatch();
  let navigation = useNavigation();

  const confirmOrder = () => {
    const order = finalOrder.order ? finalOrder.order : {}; // Ensure order is initialized

    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(`${baseURL}orders`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Order Completed',
            text2: '',
          });
          setTimeout(() => {
            dispatch(clearCart());
            navigation.navigate('Cart');
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again',
        });
      });
  };

  return (
    <Center style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Confirm Order</Text>
          {finalOrder.order ? (
            <View style={styles.box}>
              <Text style={styles.title}>Shipping to:</Text>
              <View style={{ padding: 8 }}>
                <Text>Address: {finalOrder.order.shippingAddress1}</Text>
                <Text>Address2: {finalOrder.order.shippingAddress2}</Text>
                <Text>City: {finalOrder.order.city}</Text>
                <Text>Zip Code: {finalOrder.order.zip}</Text>
                <Text>Country: {finalOrder.order.country}</Text>
              </View>
              <Text style={styles.title}>Items</Text>
              {finalOrder.order.orderItems.map((item) => {
                const photoImage = item.newData.photo.image[0];
                const photoName = item.newData.photo.name;
                const materialName = item.newData.material.name;
                const materialPrice = item.newData.material.price;
                return (
                  <HStack space={[2, 3]} justifyContent="space-between" key={item.id}>
                    <Avatar
                      size="48px"
                      source={{
                        uri: photoImage
                          ? photoImage
                          : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png',
                      }}
                    />
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {photoName}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text
                      fontSize="xs"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      alignSelf="flex-start">
                      {materialPrice}
                    </Text>
                  </HStack>
                );
              })}
            </View>
          ) : null}
          <View style={{ alignItems: 'center', margin: 20 }}>
            <Button title={'Place order'} onPress={confirmOrder} color="black" />
          </View>
        </View>
      </ScrollView>
    </Center>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  box: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 8,
    backgroundColor: 'white',
    width: '90%',
  },
});

export default Confirm;
