import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighLight,
    TouchableOpacity,
    Dimensions,
    Button,
    Modal
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"
import { useNavigation } from "@react-navigation/native"

import EasyButton from "../../../Shared/StyledComponents/EasyButton";


var { width } = Dimensions.get("window");

const ListPhoto = ({ item, index, deletePhoto }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()
    return (
        <View>
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

                        <EasyButton
                            medium
                            PhotoForm
                            onPress={() => [navigation.navigate("PhotoForm", { item }),
                            setModalVisible(false)
                            ]}
                            title="Edit"
                        >
                            <Text style={styles.textStyle}>EDIT</Text>
                        </EasyButton>
                        <EasyButton
                            medium
                            danger
                            onPress={() => [
                                deletePhoto(item._id),
                                 setModalVisible(false)]}
                            title="delete"
                        >
                            <Text style={styles.textStyle}>DELETE</Text>
                        </EasyButton>

                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("PHOTO DETAIL", { item })
                }}
                onLongPress={() => setModalVisible(true)}
                style={[styles.container, {
                    backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
                }]}
            >
                {/* <Text style={styles.item}>{item.name}</Text> */}
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{item.name ? item.name : null}</Text>
                <Text style={styles.item}>{item.description}</Text>
                <Image
                    source={{
                        uri: item.image
                            ? item.image
                            : null
                    }}
                    resizeMode="contain"
                    style={styles.image}
                />
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        width: width
    },
    image: {
        borderRadius: 50,
        width: width / 6,
        height: 20,
        margin: 2
    },
    item: {
        flexWrap: "wrap",
        margin: 3,
        width: width / 6
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
    textStyle: {
        color: "white",
        fontWeight: "bold"
    }
})

export default ListPhoto;