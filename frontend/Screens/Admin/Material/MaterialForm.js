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
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { useNavigation, useRoute } from "@react-navigation/native"
import mime from "mime";

const MaterialForm = (props) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [countInStock, setCountInStock] = useState();
    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [material, setMaterial] = useState(null);

    let navigation = useNavigation()
    let route = useRoute(); 

    useEffect(() => {
        if (route.params && route.params.item) {
            const { item } = route.params;
            setName(item.name);
            setPrice(item.price.toString());
            setImages(item.image);
            setMaterial(item); // Set the selected material
;
        } else {
            setMaterial(null);
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
    }, [route.params])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5.5, 8.5],
            quality: 1
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => ({ id: images.length, uri: asset.uri }));
            const filteredImages = images.filter(image => image.uri !== undefined); // Filter out images with undefined uri
            setImages([...filteredImages, ...selectedImages]); // Concatenate existing images (excluding images with undefined uri) with new images
        } 
    }
    
    const removeImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };

    const addMaterial = () => {
        if (
            name === "" ||
            price === "" ||
            countInStock === ""
        ) {
            setError("KINDLY COMPLETE THE FORM ACCURATELY.")
            return;
        }

        let formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("countInStock", countInStock);
        images.forEach((image, index) => {
            formData.append(`image`, {  
                uri: image.uri,
                type: mime.getType(image.uri),
                name: `image${index}.${mime.getExtension(mime.getType(image.uri))}`,
            })
        });

        console.log(images.uri)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        }
        if (material !== null) {
            console.log(material)
            axios
                .put(`${baseURL}materials/${material.id}`, formData, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "MATERIALS SUCCESSFULLY UPDATED",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Materials");
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
                .post(`${baseURL}materials/new`, formData, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "NEW MATERIALS ADDED",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Materials");
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
        <FormContainer title="MATERIALS">
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
                placeholder="NAME"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
             <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>PRICE</Text>
            </View>
            <Input
                placeholder="Price"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
            />
             <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>STOCK</Text>
            </View>
            <Input
                placeholder="Stock"
                name="stock"
                id="stock"
                value={countInStock}
                keyboardType={"numeric"}
                onChangeText={(text) => setCountInStock(text)}
            />
            {error ? <Error message={error} /> : null}
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={() => addMaterial()}
                ><Text style={styles.buttonText}>CONFIRM</Text>
                </EasyButton>
            </View>
            
        </FormContainer>
    )
}


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


export default MaterialForm;