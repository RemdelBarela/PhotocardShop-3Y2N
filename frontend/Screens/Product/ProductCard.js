import React from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    Button,
    FlatList,
    TouchableOpacity, 
    Modal,
    TextStyle,
    StyleProp,
} from 'react-native'
import { addToCart } from '../../Redux/Actions/cartActions'
import { useSelector, useDispatch } from 'react-redux'
import Toast from 'react-native-toast-message'
import { BlurView } from "expo-blur";
import { images, COLORS, SIZES, FONTS } from "./constants";
var { width } = Dimensions.get("window");

const ProductCard = (props) => {
    const { name, description, image } = props;
    const dispatch = useDispatch()
    return (
        <>
        
 <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >   
        
              <Image
            source={{
                uri: image ?
                    image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
            }} 
            resizeMode="contain"
            style={{
              width: 130,
              height: 100,
            }} />
        </View>
        <View
          style={{
            flex: 1.5,
            marginLeft: SIZES.radius,
            justifyContent: "center",
          }}
        >   
        
             <Text  style={styles.boldText}>
                {(name.length && name.length > 15) ? name.substring(0, 15 - 3)
                    + '...' : name
                }
            </Text>
            <Text style={[styles.description, FONTS.h5]}>{description}</Text>
            <Text style={styles.detailsText}>CLICK TO VIEW DETAILS</Text>
            </View>

            {/* <Button
                        title={'Add'}
                        color={'green'}
                        onPress={() => {
                            dispatch(addToCart({ ...props, quantity: 1, })),
                                Toast.show({
                                    topOffset: 60,
                                    type: "success",
                                    text1: `${name} ADDED TO CART`,
                                    text2: "GO TO YOUR CART TO COMPLETE ORDER"
                                })
                        }}
                    >
                    </Button> */}

            {/* {countInStock > 0 ? (
                <View style={{ marginBottom: 60 }}>
                    <Button
                        title={'Add'}
                        color={'green'}
                        onPress={() => {
                            dispatch(addToCart({ ...props, quantity: 1, })),
                                Toast.show({
                                    topOffset: 60,
                                    type: "success",
                                    text1: `${name} ADDED TO CART`,
                                    text2: "GO TO YOUR CART TO COMPLETE ORDER"
                                })
                        }}
                    >
                    </Button>
                </View>
            ) : <Text style={{ marginTop: 20 }}>CURRENTLY UNAVAILABLE</Text>} */}
        
          </ >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 130,
        height: 100,
        marginRight: 10,
    },
    card: {
        flexDirection: 'row',
        width: width / 2 - 20,
        height: width / 1.7,
        padding: 10,
        borderRadius: 10,
        marginTop: 55,
        marginBottom: 5,
        marginLeft: 15,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'black',
    },
    boldText: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    description: {
        fontSize: 20,
        color: 'black',
        marginTop: 5,
    },
    detailsText: {
      fontSize: 10,
      color: 'white',
      textAlign: 'center',
      marginTop: 10,
      backgroundColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
      },
      featuredShadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
      featuredDetails: {
        position: "absolute",
        top: 160,
        left: 30,
        flexDirection: "column",
        marginLeft: 25,
        marginBottom: 8,
      },
      recentSearchShadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
      recentSearches: {
        width: "100%",
        transform: [{ rotateY: "180deg" }],
      },
      blur: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
})

export default ProductCard;