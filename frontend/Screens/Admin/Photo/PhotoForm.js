import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

import baseURL from "../../../assets/common/baseurl";
import Error from "../../../Shared/Error";

import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute  } from "@react-navigation/native";
import mime from "mime";

const PhotoForm = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [photo, setPhoto] = useState(null);
    const [token, setToken] = useState();

    let navigation = useNavigation();
    let route = useRoute(); // Use useRoute hook to access route params

    useEffect(() => {
        if (route.params && route.params.item) { // Check if there's a selected photo in the route params
            const { item } = route.params;
            setName(item.name);
            setDescription(item.description);
            setImages(item.image);
            setPhoto(item); // Set the selected photo

        } else {
            setPhoto(null);
        }
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    alert("Apologies, but in order to proceed, we require permission to access your camera roll!");
                }
            }
        })();
    }, [route.params]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5.5, 8.5],
            quality: 1,
        });

        // if (!result.canceled) {
        //     const selectedImages = result.assets.map((asset) => ({ id: images.length, uri: asset.uri }));
        //     setImages([...images, ...selectedImages]);
        // }

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => ({ id: images.length, uri: asset.uri }));
            const filteredImages = images.filter(image => image.uri !== undefined); // Filter out images with undefined uri
            setImages([...filteredImages, ...selectedImages]); // Concatenate existing images (excluding images with undefined uri) with new images
        }  
        
    };

    const removeImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };

  

    const addPhoto = () => {
        if (name === '' || description === '') {
            setError('Please complete the form accurately.');
            return;
        }

        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        images.forEach((image, index) => {
            formData.append(`image`, {  // Update 'image' here
                uri: image.uri,
                type: mime.getType(image.uri),
                name: `image${index}.${mime.getExtension(mime.getType(image.uri))}`,
            });
        });

        console.log(formData)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        };

        if (photo !== null) {
            console.log(photo)
            axios
                .put(`${baseURL}photos/${photo.id}`, formData, config)
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
            axios.post(`${baseURL}photos/new`, formData, config)
                .then((res) => {
                    console.log('Response:', res);
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "New photo added",
                            text2: ""
                        });
                        setTimeout(() => {
                            console.log('Navigating to Photos screen');
                            navigation.navigate("Photos");
                            console.log('Navigation complete');
                        }, 500);
                    } else {
                        console.log('Unexpected response status:', res.status);
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again"
                    });
                })};
    };

    return (
        <FormContainer title="PHOTO">
            <View style={styles.imageContainer}>
                {images.map((imageURL, index) => {
                    console.log("Image URI:", imageURL);
                    return(

                    <View key={index}>
                         <Image style={styles.image} source={{ uri: imageURL.uri || imageURL }} />
                        <TouchableOpacity onPress={() => removeImage(imageURL.id)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>REMOVE</Text>
                        </TouchableOpacity>
                    </View>
                )})}
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Icon name="camera" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>NAME</Text>
            </View>
            <Input
                placeholder="Name"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>DESCRIPTION</Text>
            </View>
            <Input
                placeholder="Description"
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
                >
                    <Text style={styles.buttonText}>CONFIRM</Text>
                </EasyButton>
            </View>
        </FormContainer>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    imagePicker: {
        width: 100,
        height: 100,
        margin: 5,
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "red",
        padding: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    removeButtonText: {
        color: "white",
    },
    label: {
        width: "80%",
        marginTop: 10,
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
    },
})

export default PhotoForm;
