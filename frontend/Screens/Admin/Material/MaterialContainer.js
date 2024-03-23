import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions, ScrollViewComponent } from 'react-native'
import { Center, VStack, Input, Heading, Text, Icon, NativeBaseProvider, extendTheme, ScrollView, } from "native-base";
import { Ionicons, SmallCloseIcon } from "@expo/vector-icons";

import MaterialList from "./MaterialList";
import SearchedMaterial from "./SearchedMaterial";
import Banner from "../../Shared/Banner";
// import CategoryFilter from "./CategoryFilter";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
// const data = require('../../assets/data/materials.json')
// const productCategories = require('../../assets/data/categories.json')

var { width, height } = Dimensions.get("window")
const MaterialContainer = () => {
    const [materials, setMaterials] = useState([])
    const [materialsFiltered, setMaterialsFiltered] = useState([]);
    const [focus, setFocus] = useState();
    // const [categories, setCategories] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([])
    const [materialsCtg, setMaterialsCtg] = useState([])
    
    // useEffect(() => {
    //     setMaterials(data);
    //     setMaterialsFiltered(data);
    //     setFocus(false);
    //     setCategories(productCategories)
    //     setActive(-1)
    //     setInitialState(data)
    //     setMaterialsCtg(data)
    //     return () => {
    //         setMaterials([])
    //         setMaterialsFiltered([]);
    //         setFocus()
    //         setCategories([])
    //         setActive()
    //         setInitialState();
    //         setMaterialsCtg([])
    //     }
    // }, [])
    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);
                // Products
                axios
                    .get(`${baseURL}materials`)
                    .then((res) => {
                        setMaterials(res.data);
                        setMaterialsFiltered(res.data);
                        setMaterialsCtg(res.data);
                        setInitialState(res.data);
                        // setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })
    
                // // Categories
                // axios
                //     .get(`${baseURL}categories`)
                //     .then((res) => {
                //         setCategories(res.data)
                //     })
                //     .catch((error) => {
                //         console.log('Api categories call error', error)
                //     })
    
                return () => {
                    setMaterials([]);
                    setMaterialsFiltered([]);
                    setFocus();
                    // setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))
    
    const searchMaterial = (text) => {
        setMaterialsFiltered(
            materials.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }

    // const changeCtg = (ctg) => {
    //     console.log(ctg)
    //     {
    //         ctg === "all"
    //             ? [setMaterialsCtg(initialState), setActive(true)]
    //             : [
    //                 setMaterialsCtg(
    //                     materials.filter((i) => i.category.$oid === ctg),
    //                     setActive(true)
    //                 ),
    //             ];
    //     }
    // };

    const changeCtg = (ctg) => {
        console.log(ctg)
        {
            ctg === "all"
                ? [setMaterialsCtg(initialState), setActive(true)]
                : [
                    setMaterialsCtg(
                        materials.filter((i) => (i.category !== null && i.category.id) === ctg ),
                        setActive(true)
                    ),
                ];
        }
    };

    console.log(materials)

    return (
        
            <Center>
                <VStack w="100%" space={5} alignSelf="center">
                    <Input
                        onFocus={openList}
                        onChangeText={(text) => searchMaterial(text)}
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
                    <SearchedMaterial
                        materialsFiltered={materialsFiltered}
                    />
                ) : (
                    <ScrollView>
                        <View>
                            <Banner />
                        </View>
                        {/* <View >
                            <CategoryFilter
                                categories={categories}
                                categoryFilter={changeCtg}
                                materialsCtg={materialsCtg}
                                active={active}
                                setActive={setActive}
                            />
                        </View> */}
                        {materialsCtg.length > 0 ? (
                                <View style={styles.listContainer}>
                                    {materialsCtg.map((item) => {
                                        return(
                                            <MaterialList
                                                // navigation={props.navigation}
                                                key={item._id.$oid}
                                                item={item}
                                            />
                                        )
                                    })}
                                </View>
                                ) : (
                                    <View style={[styles.center, { height: height / 2}]}>
                                        <Text>No materials found</Text>
                                    </View>
                                )}
                        {/* <FlatList
                            //    horizontal
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            numColumns={2}
                            data={materials}
                            // renderItem={({item}) => <Text>{item.brand}</Text>}
                            renderItem={({ item }) => <MaterialList key={item.brand} item={item} />}
                            keyExtractor={item => item.name}
                        /> */}
                    </ScrollView>

                )}
            </Center>
  
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    listContainer: {
        height: height,
        width: width,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MaterialContainer;