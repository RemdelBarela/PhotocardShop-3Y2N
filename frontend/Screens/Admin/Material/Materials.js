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
} from "react-native";
import { Box } from "native-base"
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

    const [materialList, setMaterialList] = useState([]);
    const [materialFilter, setMaterialFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const navigation = useNavigation()

    const searchMaterial = (text) => {
        if (text === "") {
            setMaterialFilter(materialList)
        }
        setMaterialFilter(
            materialList.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deleteMaterial = (id) => {
        axios
            .delete(`${baseURL}materials/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const materials = materialFilter.filter((item) => item.id !== id)
                setMaterialFilter(materials)

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
                    setMaterialList(res.data);
                    setMaterialFilter(res.data);
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
                        setMaterialList(res.data);
                        setMaterialFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setMaterialList();
                    setMaterialFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const handleRowPress = (material) => {
        setSelectedMaterial(material);
        setModalVisible(true);
    };
    return (
        <Box flex={1}>
            <View style={styles.buttonContainer}>
                <EasyButton
                    secondary
                    medium
                    onPress={() => navigation.navigate("MaterialForm")}
                >
                    <Icon name="plus" size={18} color="white" />
                    <Text style={styles.buttonText}> ADD</Text>
                </EasyButton>
            </View>

            <Searchbar
                width="80%"
                placeholder="Search Material Name"
                onChangeText={(text) => searchMaterial(text)}
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
                        {selectedMaterial && (
                            <>
                                <Text>{selectedMaterial.name}</Text>
                                <EasyButton
                                    medium
                                    secondary
                                    onPress={() => {
                                        navigation.navigate("MaterialForm", { item: selectedMaterial });
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
                                        deleteMaterial(selectedMaterial.id);
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

            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="x-large" color="black" />
                </View>
            ) : (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Name</DataTable.Title>
                            <DataTable.Title>Price</DataTable.Title>
                            <DataTable.Title>Stock</DataTable.Title>
                            <DataTable.Title>Images</DataTable.Title>
                        </DataTable.Header>
                        {materialFilter.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRowPress(item)}
                                style={[styles.container, {
                                    backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
                                }]}
                            >
                                <DataTable.Row>
                                    <DataTable.Cell>{item.name}</DataTable.Cell>
                                    <DataTable.Cell>{item.price}</DataTable.Cell>
                                    <DataTable.Cell>{item.countInStock}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.image.map((imageUrl, idx) => (
                                            <Image
                                                key={idx}
                                                source={{
                                                    uri: imageUrl ? imageUrl : null
                                                }}
                                                resizeMode="contain"
                                                style={styles.image}
                                                onError={() => console.log("Error loading image")}
                                            />
                                        ))}
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
    image: {
        width: 10, // Adjust image width as needed
        height: 10, // Adjust image height as needed
        marginRight: 5, // Add margin between images
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

