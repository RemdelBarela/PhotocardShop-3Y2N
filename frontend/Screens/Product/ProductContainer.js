import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions, ScrollViewComponent } from 'react-native'
import {
    Center, VStack, Input, TouchableOpacity,
    Image,
    Modal,
    TextStyle,
    StyleProp, Heading, Text, Icon, NativeBaseProvider, extendTheme, ScrollView,
} from "native-base";
import { Ionicons, SmallCloseIcon } from "@expo/vector-icons";

import { BlurView } from "expo-blur";
import { images, COLORS, SIZES, FONTS } from "./constants";
import ProductList from "./ProductList";

import SearchedProduct from "./SearchedProduct";

import axios from "axios";
import baseURL from "../../assets/common/baseurl";

var { width, height } = Dimensions.get("window")
const ProductContainer = () => {
    const [products, setProducts] = useState([])
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState();
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([])
    const [productsCtg, setProductsCtg] = useState([])

    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);
    
                axios
                    .get(`${baseURL}photos`)
                    .then((res) => {
                        setProducts(res.data);
                        setProductsFiltered(res.data);
                        setProductsCtg(res.data);
                        setInitialState(res.data);
                        // setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                // Categories
                // axios
                //     .get(`${baseURL}categories`)
                //     .then((res) => {
                //         setCategories(res.data)
                //     })
                //     .catch((error) => {
                //         console.log('Api categories call error', error)
                //     })

                return () => {
                    setProducts([]);
                    setProductsFiltered([]);
                    setFocus();
                    // setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }

    return (
    <View style={styles.container}>
   
            <VStack w="100%" space={5} alignSelf="center">
                <Input
                    onFocus={openList}
                    onChangeText={(text) => searchProduct(text)}
                    placeholder="Search"
                    variant="filled"
                    width="100%"
                    borderRadius="10"
                    py="1"
                    px="2"
                    InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />}
                    // InputRightElement={focus == true ? <SmallCloseIcon onPress={onBlur} /> : null}
                    InputRightElement={focus === true ? <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="close" size="12" color="black" onPress={onBlur} />} /> : null}
                />
            </VStack>
            {focus === true ? (
                <SearchedProduct
                    productsFiltered={productsFiltered}
                />
            ) : (
                <ScrollView>
                    {productsCtg.length > 0 ? (
                <View style={styles.listContainer}>
                              {productsCtg.map((item) => {
                                    return (
                                        <View key={item._id.$oid} style={styles.productListItem}>
                                        <ProductList item={item} />
                                    </View>
                                    )
                                })}
                            </View>
                        ) : (
                            <View style={[styles.center, { height: height / 2 }]}>
                                <Text>NO PRODUCTS FOUND</Text>
                            </View>
                        )}
                     
                </ScrollView>

            )}
       </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    listContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        marginTop: SIZES.padding,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
        margin: 10,
    },
    productListItem: {
        width: "100%",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }, container: {
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
});

export default ProductContainer;