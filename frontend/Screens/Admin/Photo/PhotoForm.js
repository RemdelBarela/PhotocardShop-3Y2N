import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native"

import FormContainer from "../../../Shared/Form/FormContainer"
import Input from "../../../Shared/Form/Input"
import EasyButton from "../../../Shared/StyledComponents/EasyButton"

import baseURL from "../../../assets/common/baseurl"
import Error from "../../../Shared/Error"

import Icon from "react-native-vector-icons/FontAwesome"
import Toast from "react-native-toast-message"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"
import mime from "mime";

const PhotoForm = (props) => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [mainImage, setMainImage] = useState();
    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [item, setItem] = useState(null);

    let navigation = useNavigation()

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setName(props.route.params.item.name);
            setDescription(props.route.params.item.description);
            setMainImage(props.route.params.item.image);
            setImage(props.route.params.item.image);
        }

        (async () => {
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "GRANTED") {
                    alert("APOLOGIES, BUT IN ORDER TO PROCEED, WE REQUIRE PERMISSION TO ACCESS YOUR CAMERA ROLL!")
                }
            }
        })();
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            console.log(result)
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }
    
    const addPhoto = () => {
        if (
            name === "" ||
            description === ""
        ) {
            setError("KINDLY COMPLETE THE FORM ACCURATELY.")
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        }
        if (item !== null) {
            console.log(item)
            axios
                .put(`${baseURL}photos/${item.id}`, formData, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "PHOTO SUCCESSFULLY UPDATED",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Photos");
                        }, 500)
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
        } else {
            axios
                .post(`${baseURL}photos/new`, formData, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "NEW PHOTO ADDED",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Photos");
                        }, 500)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "SOMETHING WENT WRONG",
                        text2: "PLEASE TRY AGAIN"
                    })
                })

        }

    }

    return (
        <FormContainer title="ADD PHOTO">
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: mainImage }} />
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imagePicker}>
                    <Icon style={{ color: "white" }} name="camera" />
                </TouchableOpacity>
            </View>

            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>NAME</Text>
            </View>
            <Input
                placeholder="NAME"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>DESCRIPTION</Text>
            </View>
            <Input
                placeholder="DESCRIPTION"
                name="description"
                id="description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            
            {error ? <Error message={error} /> : null}
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={() => addPhoto()}
                ><Text style={styles.buttonText}>CONFIRM</Text>
                </EasyButton>
            </View>
            
        </FormContainer>
    )
}


const styles = StyleSheet.create({
    label: {
        width: "80%",
        marginTop: 10
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20
    }
})


export default PhotoForm;