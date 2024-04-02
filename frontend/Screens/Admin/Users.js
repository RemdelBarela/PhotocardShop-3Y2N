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
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native"

import baseURL from "../../assets/common/baseurl"
import EasyButton from "../../Shared/StyledComponents/EasyButton";

const Users = (props) => {

    const [photoList, setUserList] = useState([]);
    const [photoFilter, setUserFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation()


    const searchUser = (text) => {
        if (text === "") {
            setUserFilter(photoList)
        }
        setUserFilter(
            photoList.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deleteUser = (id) => {
        axios
            .delete(`${baseURL}users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const users = photoFilter.filter((item) => item.id !== id)
                setUserFilter(users)

                onRefresh()
            })
            .catch((error) => console.log(error));
    }

    const makeAdmin = (userID) => {

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };


        axios
            .put(`${baseURL}users/admin/${userID}`, config)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "USER ROLE SUCCESSFULLY UPDATED",
                        text2: ""
                    });
                    setTimeout(() => {
                        navigation.navigate("Users");
                    }, 500)
                    onRefresh()
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "SOMETHING WENT WRONG",
                    text2: "PLEASE TRY AGAIN"
                })
            })

    };

    const makeUser = (userID) => {

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };


        axios
            .put(`${baseURL}users/user/${userID}`, config)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "USER ROLE SUCCESSFULLY UPDATED",
                        text2: ""
                    });
                    setTimeout(() => {
                        navigation.navigate("Users");
                    }, 500)
                    onRefresh()
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "SOMETHING WENT WRONG",
                    text2: "PLEASE TRY AGAIN"
                })
            })

    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}users`)
                .then((res) => {
                    // console.log(res.data)
                    setUserList(res.data);
                    setUserFilter(res.data);
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
                    .get(`${baseURL}users`)
                    .then((res) => {
                        console.log(res.data)
                        setUserList(res.data);
                        setUserFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setUserList();
                    setUserFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const handleRowPress = (photo) => {
        setSelectedUser(photo);
        setModalVisible(true);
    };

    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
    };
    const renderGallery = () => {
        // Check if selectedUser is defined and has image property
        if (selectedUser && selectedUser.image) {
            return (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {/* Check if image is an array */}
                    {Array.isArray(selectedUser.image) ? (
                        // Map over the image array
                        selectedUser.image.map((imageUrl, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleImagePress(imageUrl)}>
                                <Image
                                    source={{
                                        uri: imageUrl || null, // Ensure imageUrl is not undefined
                                    }}
                                    resizeMode="cover"
                                    style={{ width: width, height: width / 2, marginVertical: 5 }}
                                    onError={() => console.log('Error loading image')}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        // Render a single image if not an array
                        <TouchableOpacity onPress={() => handleImagePress(selectedUser.image)}>
                            <Image
                                source={{
                                    uri: selectedUser.image || null, // Ensure imageUrl is not undefined
                                }}
                                resizeMode="cover"
                                style={{ width: width, height: width / 2, marginVertical: 5 }}
                                onError={() => console.log('Error loading image')}
                            />
                        </TouchableOpacity>
                    )}
                </ScrollView>
            );
        } else {
            return <Text>No images available for this photo.</Text>;
        }
    };



    return (
        <Box flex={1}>
            <View style={styles.buttonContainer}>
                <Searchbar
                    placeholder="Search User Name"
                    onChangeText={(text) => searchUser(text)}
                    style={{ flex: 1 }} // Allow the search bar to take remaining space
                />

            </View>

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
                            <Icon name="close" size={50} />
                        </TouchableOpacity>
                        {selectedUser && (
                            <>
                                <Text style={styles.header}>{selectedUser.name}</Text>
                                {renderGallery()}
                                {selectedUser.isAdmin === false && (
                                <EasyButton
                                    medium
                                    style={{ backgroundColor: "black" }}

                                    onPress={() => {
                                        makeAdmin(selectedUser._id)
                                        setModalVisible(false);
                                    }}
                                    title="ADMIN"
                                >
                                    <Text style={{ color: "white", letterSpacing: 2 }}>ADMIN</Text>
                                </EasyButton>
                                 )}
                                 {selectedUser.isAdmin === true && (
                                <EasyButton
                                    medium
                                    style={{ backgroundColor: "black" }}

                                    onPress={() => {
                                        makeUser(selectedUser._id)
                                        setModalVisible(false);
                                    }}
                                    title="USER"
                                >
                                    <Text style={{ color: "white", letterSpacing: 2 }}>USER</Text>
                                </EasyButton>
                                 )}
                                <EasyButton
                                    medium
                                    danger
                                    onPress={() => {
                                        deleteUser(selectedUser.id);
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


                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>EMAIL</Text></DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>PHONE</Text></DataTable.Title>

                        <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>ROLE</Text></DataTable.Title>
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
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{item.email}</DataTable.Cell>
                                <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>{item.phone}</DataTable.Cell>
                                {item.isAdmin === false && (
                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>USER</DataTable.Cell>
                                )}
                                {item.isAdmin === true && (
                                    <DataTable.Cell style={{ justifyContent: 'center', alignItems: 'center' }}>ADMIN</DataTable.Cell>

                                )}
                                <DataTable.Cell
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 10,
                                        backgroundColor: 'black',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 20 // Half of width or height to make it circular
                                    }}
                                >
                                    <Icon name="eye" size={18} color="white" />
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
    }, header: {
        fontSize: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
});

export default Users;
