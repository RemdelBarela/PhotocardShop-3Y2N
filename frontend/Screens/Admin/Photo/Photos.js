import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    RefreshControl,

} from "react-native";
import { Input, VStack, Heading, Box } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import { Searchbar } from 'react-native-paper';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native"

import ListPhoto from "./ListPhoto"
import baseURL from "../../../assets/common/baseurl"
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

const Photos = (props) => {

    const [photoList, setPhotoList] = useState([]);
    const [photoFilter, setPhotoFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()

    const ListHeader = () => {
        return (
            <View
                elevation={1}
                style={styles.listHeader}
            >
                <View style={styles.headerItem}></View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>NAME</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>DESCRIPTION</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>IMAGES</Text>
                </View>
            </View>
        )
    }

    const searchPhoto = (text) => {
        if (text === "") {
            setPhotoFilter(photoList)
        }
        setPhotoFilter(
            photoList.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deletePhoto = (id) => {
        axios
            .delete(`${baseURL}photos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const photos = photoFilter.filter((item) => item.id !== id)
                setPhotoFilter(photos)
            })
            .catch((error) => console.log(error));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}photos`)
                .then((res) => {
                    // console.log(res.data)
                    setPhotoList(res.data);
                    setPhotoFilter(res.data);
                    setLoading(false);
                })
            setRefreshing(false);
        }, 2000);
    }, []);
    useFocusEffect(
        useCallback(
            () => {
                // Get Token
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))
                axios
                    .get(`${baseURL}photos`)
                    .then((res) => {
                        console.log(res.data)
                        setPhotoList(res.data);
                        setPhotoFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setPhotoList();
                    setPhotoFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )
    return (
        <Box flex={1}>
            <View style={styles.buttonContainer}>
                
                <EasyButton
                    secondary
                    medium
                    onPress={() => navigation.navigate("PhotoForm")}
                >
                    <Icon name="plus" size={18} color="white" />
                    <Text style={styles.buttonText}> ADD</Text>
                </EasyButton>
            </View>

            <Searchbar width="80%"
                placeholder="Search Photo Name"
                onChangeText={(text) => searchPhoto(text)}
            //   value={searchQuery}
            />
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (<FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={ListHeader}
                data={photoFilter}
                renderItem={({ item, index }) => (
                    <ListPhoto
                        item={item}
                        index={index}
                        deletePhoto={deletePhoto}

                    />
                )}
                keyExtractor={(item) => item.id}
            />)}


        </Box>
    );
}

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro'
    },
    headerItem: {
        margin: 3,
        width: width / 6
    },
    spinner: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        marginBottom: 160,
        backgroundColor: 'white'
    },
    buttonContainer: {
        margin: 20,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        marginLeft: 4,
        color: 'white'
    }
})

export default Photos;