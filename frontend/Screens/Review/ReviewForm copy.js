import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import baseURL from "../../assets/common/baseurl";
import Error from "../../Shared/Error";

import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute  } from "@react-navigation/native";
import mime from "mime";
import StarRating from "../../Shared/StarRating";

const ReviewForm = (props) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    // const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState(null);
    const [token, setToken] = useState();

    let navigation = useNavigation();
    let route = useRoute();

    useEffect(() => {
        if (route.params && route.params.item) {
            const { item } = route.params;
            setReview(item.review);
            setRating(item.rating);
            // setImages(item.image);
            setReviews(item); 

        } else {
            setReviews(null);
        }
        // (async () => {
        //     if (Platform.OS !== "web") {
        //         const { status } = await ImagePicker.requestCameraPermissionsAsync();
        //         if (status !== "granted") {
        //             alert("Apologies, but in order to proceed, we require permission to access your camera roll!");
        //         }
        //     }
        // })();
    }, [route.params]);

    // const pickImage = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [1,1],
    //         quality: 1,
    //     });

    //     if (!result.canceled) {
    //         const selectedImages = result.assets.map((asset) => ({ id: images.length, uri: asset.uri }));
    //         const filteredImages = images.filter(image => image.uri !== undefined);
    //         setImages([...filteredImages, ...selectedImages]); 
    //     }  
        
    // };

    // const removeImage = (id) => {
    //     setImages(images.filter((image) => image.id !== id));
    // };

    const addReview = () => {
        if ( rating === '' || review === '') {
            setError('Please complete the form accurately.');
            return;
        }

        let formData = new FormData();
        formData.append("review", review);
        formData.append("rating", rating);
        // images.forEach((image, index) => {
        //     formData.append(`image`, {  // Update 'image' here
        //         uri: image.uri,
        //         type: mime.getType(image.uri),
        //         reviews: `image${index}.${mime.getExtension(mime.getType(image.uri))}`,
        //     });
        // });

        
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        };

        if (reviews !== null) {
            axios
                .put(`${baseURL}reviews/${reviews.id}`, formData, config)

                .then((res) => {
                    if (res.status === 200 || res.status === 201) {

                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "REVIEW SUCCESSFULLY UPDATED",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("User Profile");
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
            console.log('form: ', formData)

            axios.post(`${baseURL}reviews/new`, formData, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        console.log(res)
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "New review added",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("User Profile");
                        }, 500);
                    } else {
                        console.log('Unexpected response status:', res.status);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log('Error status:', error.response.status);
                        console.log('Error data:', error.response.data);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log('Error request:', error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error message:', error.message);
                    }
                    console.log('Error config:', error.config);
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again"
                    });
                })};
    };

    return (
        <FormContainer title="REVIEW">
            {/* <View style={styles.imageContainer}>
                {images.map((imageURL, index) => {
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
            </View> */}
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>COMMENT</Text>
            </View>
            <Input
                placeholder="Review"
                name="review"
                id="review"
                value={review}
                onChangeText={(text) => setReview(text)}
            />
            <View style={styles.label}>
                    <Text style={{ textDecorationLine: "underline" }}>RATING</Text>
                </View>
                <StarRating
                    maxStars={5} // Set the maximum number of stars
                    rating={parseInt(rating)} // Parse the rating to integer and pass it as props
                    onChangeRating={(newRating) => setRating(newRating.toString())} // Convert the rating back to string
            />
            {error ? <Error message={error} /> : null}
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={() => addReview()}
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

export default ReviewForm;
