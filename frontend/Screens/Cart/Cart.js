import React, {useContext} from 'react'
import  { useState } from 'react';
import { Text, View, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Box, VStack, HStack, Button, Avatar, Spacer, } from 'native-base';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import { SwipeListView } from 'react-native-swipe-list-view';
import { updateCart, removeFromCart, clearCart } from '../../Redux/Actions/cartActions'
var { height, width } = Dimensions.get("window");
import EasyButton from "../../Shared/StyledComponents/EasyButton"
import AuthGlobal from "../../Context/Store/AuthGlobal"


const Cart = () => {

    
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cartItems)
    const context = useContext(AuthGlobal)

    const handleCountChange = (item, change) => {
        const updatedCartItems = cartItems.map(cartItem => {
            if (cartItem.newData._id === item.newData._id) {
                const newQuantity = Math.max(cartItem.quantity + change, 0); // Ensure new quantity is at least 0
                if (newQuantity === 0) {
                    return null; // Remove the item by returning null
                } else {
                    return { ...cartItem, quantity: newQuantity };
                }
            }
            return cartItem;
        }).filter(Boolean); // Remove null values from the updated array
        dispatch(updateCart(updatedCartItems));
    };


    const total = cartItems.reduce((acc, cart) => {
        const materialPrice = cart?.newData?.material?.price || 0; // Ensure material exists and price is available
        return acc + materialPrice * cart.quantity;
    }, 0);
    const renderItem = ({ item, index }) => {
        const photoImage = item.newData.photo.image[0];
        const photoName = item.newData.photo.name;
        const materialName = item.newData.material.name;
        const materialPrice = item.newData.material.price;
        const materialImage = item.newData.material.image[0];
        
        // Determine if the plus button should be disabled
        const isDisabled = item.quantity >= item.newData.material.stock;
        
        return (
            <TouchableHighlight
                _dark={{
                    bg: 'coolGray.800'
                }}
                _light={{
                    bg: 'white'
                }}
            >
                <Box pl="4" pr="5" py="2" bg="coolGray.200" borderColor="black" borderWidth={1} borderRadius={10} keyExtractor={item => item.id} margin={15} shadow={5} shadowColor="rgba(0, 0, 0, 0.6)">
                    <HStack alignItems="center" justifyContent="space-between">
                        <Avatar size="48px" source={{
                            uri: photoImage ?
                                photoImage : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }} />
                        <VStack>
                            <Text color="coolGray.800" _dark={{
                                color: 'warmGray.50'
                            }} bold>
                                {photoName}
                            </Text>
                            <Text fontSize="sm" color="coolGray.800" _dark={{
                                color: 'warmGray.50'
                            }} alignSelf="flex-start">
                                {materialName} - $ {materialPrice}
                            </Text>
                        </VStack>
                        <HStack alignItems="center">
                            <TouchableOpacity onPress={() => handleCountChange(item, -1)}>
                                <Icon name="minus" size={20} color="white" style={{ backgroundColor: 'black', padding: 5, borderRadius: 5 }} />
                            </TouchableOpacity>
                            <Text fontSize="sm" color="coolGray.800" _dark={{
                                color: 'warmGray.50'
                            }} alignSelf="center" style={{ marginHorizontal: 5 }}>
                                {item.quantity}
                            </Text>
                            <TouchableOpacity onPress={() => handleCountChange(item, 1)} disabled={isDisabled}>
                                <View style={{ backgroundColor: 'black', padding: 5, borderRadius: 5 }}>
                                    <Icon name="plus" size={20} color={isDisabled ? "gray" : "white"} />
                                </View>
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                </Box>
            </TouchableHighlight>
        );
    };
    
    
    const renderHiddenItem = (cartItems) =>
        <TouchableOpacity
            onPress={() => dispatch(removeFromCart(cartItems.item))}
        >
            <VStack alignItems="center" style={styles.hiddenButton} >
                <View >
                    <Icon name="trash" color={"white"} size={30} bg="red" />
                    <Text color="white" fontSize="xs" fontWeight="medium">
                        Delete
                    </Text>
                </View>
            </VStack>
    
        </TouchableOpacity>;
    
    return (
        <>
            {cartItems.length > 0 ? (
                <Box bg="lightgray" safeArea flex="1" width="100%" >
                    <SwipeListView
                        data={cartItems}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        disableRightSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-150}
                        previewOpenValue={-100}
                        previewOpenDelay={3000}
                        keyExtractor={item => item.newData ? item.newData._id : item.id}
                        />
                </Box>
            ) : (
                <Box style={styles.emptyContainer}>
                    <Text >No items in cart
                    </Text>
                </Box>
            )}
            <VStack  style={styles.bottomContainer} w='100%' justifyContent='space-between'
            >
                <HStack justifyContent="space-between">
                    <Text style={styles.price}>$ {total.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                    {/* <Button alignItems="center" onPress={() => dispatch(clearCart())} >Clear</Button> */}
                    <EasyButton
                        danger
                        medium
                        alignItems="center"
                        onPress={() => dispatch(clearCart())}
                        style={{
                            height: 50,
                            borderRadius: 10,
                            borderColor: 'white',
                            borderWidth: 1,
                            justifyContent: 'center', // To center the text vertically
                            alignItems: 'center',     // To center the text horizontally
                        }}
                    >
    <Text style={{ color: 'white', textAlign: 'center' }}>Clear</Text>
</EasyButton>

                </HStack>
                {/* <HStack justifyContent="space-between">
                   
                    <Button alignItems="center" colorScheme="primary" onPress={() => navigation.navigate('Checkout')}>Check Out</Button>
                </HStack> */}
                {context.stateUser.isAuthenticated ? (
                    <EasyButton
                        primary
                        medium
                        onPress={() => navigation.navigate('Checkout')}
                        style={{
                            height: 50,
                            borderRadius: 10,
                            borderColor: 'white',
                            borderWidth: 1,
                            justifyContent: 'center', // To center the text vertically
                            alignItems: 'center',     // To center the text horizontally
                        }}
                    >
    <Text style={{ color: 'white', textAlign: 'center' }}>Checkout</Text>
</EasyButton>

                ) : (
                    <EasyButton
                    secondary
                    medium
                    onPress={() => navigation.navigate("User", {screen: 'Login'})}
                    style={{
                        height: 50,
                        borderRadius: 10,
                        borderColor: 'white',
                        borderWidth: 1,
                        justifyContent: 'center', // To center the text vertically
                        alignItems: 'center',     // To center the text horizontally
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
                </EasyButton>
                
                )}
            </VStack >
        </>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        height: height,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        elevation: 20
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'red'
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        // width: 'lg'
    },
    hiddenButton: {
       
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 25,
        height: 70,
        width: width / 1.2
    }
});

export default Cart