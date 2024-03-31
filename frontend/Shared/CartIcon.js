import React from "react";
import { StyleSheet } from "react-native";
import { Badge, Text } from "native-base";
import { useSelector } from 'react-redux';

const CartIcon = () => {
  const cartItems = useSelector(state => state.cartItems);
  // Count the number of unique items in the cart
  const uniqueItemsCount = new Set(cartItems.map(item => item.newData._id)).size;
  console.log('cartCount: ', uniqueItemsCount)
  return (
    <>
      {uniqueItemsCount ? (
          <Text style={styles.text}>{uniqueItemsCount}</Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    width: 100,
    fontWeight: "bold",
    color: "white"
  },
});

export default CartIcon;
