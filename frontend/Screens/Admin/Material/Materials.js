import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Box } from "native-base";
import { DataTable, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native"

import baseURL from "../../../assets/common/baseurl"
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

const Materials = (props) => {

    const [photoList, setPhotoList] = useState([]);
    const [photoFilter, setPhotoFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation()


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
            .delete(`${baseURL}materials/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const materials = photoFilter.filter((item) => item.id !== id)
                setPhotoFilter(materials)

                onRefresh()
            })
            .catch((error) => console.log(error));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}materials`)
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
                    .get(`${baseURL}materials`)
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

    const handleRowPress = (photo) => {
        setSelectedPhoto(photo);
        setModalVisible(true);
    };

    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
    };

    const renderGallery = () => {
        if (selectedPhoto && selectedPhoto.image.length > 0) {
            return (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {selectedPhoto.image.map((imageUrl, idx) => (
                        <TouchableOpacity key={idx} onPress={() => handleImagePress(imageUrl)}>
                            <Image
                                source={{
                                    uri: imageUrl ? imageUrl : null,
                                }}
                                resizeMode="cover"
                                style={{ width: width, height: width / 2, marginVertical: 5 }}
                                onError={() => console.log('Error loading image')}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            );
        } else {
            return <Text>No images available for this photo.</Text>;
        }
    };

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
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor="#E8E8E8"
                            onPress={() => {
                                setModalVisible(false)
                            }}
                            style={{
                                alignSelf: "flex-end",
                                position: "absolute",
                                top: 5,
                                right: 10
                            }}
                        >
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        {selectedPhoto && (
                            <>
                                <Text>{selectedPhoto.name}</Text>
                                {renderGallery()}
                                <EasyButton
                                    medium
                                    secondary
                                    onPress={() => {
                                        navigation.navigate("PhotoForm", { item: selectedPhoto });
                                        setModalVisible(false);
                                    }}
                                    title="Edit"
                                >
                                    <Text style={styles.textStyle}>EDIT</Text>
                                </EasyButton>
                                <EasyButton
                                    medium
                                    danger
                                    onPress={() => {
                                        deletePhoto(selectedPhoto.id);
                                        setModalVisible(false);
                                    }}
                                    title="Delete"
                                >
                                    <Text style={styles.textStyle}>DELETE</Text>
                                </EasyButton>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={imageModalVisible}
                onRequestClose={() => {
                    setImageModalVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor="#E8E8E8"
                            onPress={() => {
                                setImageModalVisible(false)
                            }}
                            style={{
                                alignSelf: "flex-end",
                                position: "absolute",
                                top: 5,
                                right: 10
                            }}
                        >
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        <Image
                            source={{
                                uri: selectedImage ? selectedImage : null,
                            }}
                            resizeMode="contain"
                            style={{ width: width - 40, height: height / 2 }}
                            onError={() => console.log('Error loading image')}
                        />
                    </View>
                </View>
            </Modal>

            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (
                <DataTable>
                    <DataTable.Header style={{ backgroundColor: 'black' }}>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }} ><Text style={{ color: 'white' }}>NAME</Text></DataTable.Title>
                      
                 
                             <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text  style={{ color: 'white' }}>PRICE</Text></DataTable.Title>
                            <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text  style={{ color: 'white' }}>STOCK</Text></DataTable.Title>
                          <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>VIEW</Text></DataTable.Title>
                 
                      
                         </DataTable.Header>
                    {photoFilter.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleRowPress(item)}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'lightgray' : 'gainsboro',
                            }}>
                            <DataTable.Row>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{item.price}</DataTable.Cell>
                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{item.countInStock}</DataTable.Cell>
                                  
                               
                               
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textDecorationLine: 'underline' }}>View</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </TouchableOpacity>
                    ))}
                </DataTable>
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
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
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
});

export default Materials;
