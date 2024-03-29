import React, { useContext, useState } from 'react';
import { Text, Box, VStack, HStack, Avatar, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from "react-native-vector-icons/FontAwesome";
import { removeFromCart, clearCart } from '../../Redux/Actions/cartActions';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const renderItem = ({ item, index, handleDecrement, handleIncrement, photoImage, photoName, materialPrice }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <TouchableOpacity>
            <Box pl="4" pr="5" py="2" bg="coolGray.200" borderColor="black" borderWidth={1} borderRadius={10} margin={15} shadow={5} shadowColor="rgba(0, 0, 0, 0.6)">
                <HStack alignItems="center" justifyContent="space-between">
                    <Avatar size="48px" source={{ uri: photoImage ? photoImage : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }} />
                    <VStack>
                        <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>{photoName}</Text>
                        <Text fontSize="sm" color="coolGray.800" _dark={{ color: 'warmGray.50' }} alignSelf="flex-start">$ {materialPrice}</Text>
                    </VStack>
                    <HStack alignItems="center">
                        <TouchableOpacity onPress={handleDecrement}>
                            <Icon name="minus" size={20} color="white" style={{ backgroundColor: 'black', padding: 5, borderRadius: 5 }} />
                        </TouchableOpacity>
                        <Text fontSize="sm" color="coolGray.800" _dark={{ color: 'warmGray.50' }} alignSelf="center" style={{ marginHorizontal: 5 }}>{quantity}</Text>
                        <TouchableOpacity onPress={handleIncrement}>
                            <Icon name="plus" size={20} color="white" style={{ backgroundColor: 'black', padding: 5, borderRadius: 5 }} />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};

const renderHiddenItem = (cartItems, dispatch) => (
    <TouchableOpacity onPress={() => dispatch(removeFromCart(cartItems.item))}>
        <VStack alignItems="center" style={styles.hiddenButton}>
            <View>
                <Icon name="trash" color={"white"} size={30} bg="red" />
                <Text color="white" fontSize="xs" fontWeight="medium">Delete</Text>
            </View>
        </VStack>
    </TouchableOpacity>
);

const Cart = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartItems);
    const context = useContext(AuthGlobal);
    const total = cartItems.reduce((acc, cart) => {
        const materialPrice = cart?.newData?.material?.price || 0;
        return acc + materialPrice * cart.quantity;
    }, 0);

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    return (
        <>
            {cartItems.length > 0 ? (
                <Box bg="white" safeArea flex="1" width="100%">
                    <SwipeListView
                        data={cartItems}
                        renderItem={({ item, index }) => renderItem({ item, index, handleDecrement, handleIncrement })}
                        renderHiddenItem={({ item }) => renderHiddenItem(item, dispatch)}
                        disableRightSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-150}
                        previewOpenValue={-100}
                        previewOpenDelay={3000}
                        keyExtractor={item => item.newData._id}
                    />
                </Box>
            ) : (
                <Box style={styles.emptyContainer}>
                    <Text>No items in cart</Text>
                </Box>
            )}
            <VStack style={styles.bottomContainer} w='100%' justifyContent='space-between'>
                <HStack justifyContent="space-between">
                    <Text style={styles.price}>$ {total.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                    <EasyButton
                        danger
                        medium
                        alignItems="center"
                        onPress={() => dispatch(clearCart())}
                    >
                        <Text style={{ color: 'white' }}>Clear</Text>
                    </EasyButton>
                </HStack>
                {context.stateUser.isAuthenticated ? (
                    <EasyButton
                        primary
                        medium
                        onPress={() => navigation.navigate('Checkout')}
                    >
                        <Text style={{ color: 'white' }}>Checkout</Text>
                    </EasyButton>
                ) : (
                    <EasyButton
                        secondary
                        medium
                        onPress={() => navigation.navigate("User", { screen: 'Login' })}
                    >
                        <Text style={{ color: 'white' }}>Login</Text>
                    </EasyButton>
                )}
            </VStack >
        </>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        elevation: 20
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'red'
    },
    hiddenButton: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 25,
        height: 70,
        width: '80%'
    }
});

export default Cart;
