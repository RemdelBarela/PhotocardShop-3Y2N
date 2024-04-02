import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import mime from "mime";

const UpdateProfile = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState(user.image);
    const [token, setToken] = useState();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Apologies, but in order to proceed, we require permission to access your camera roll!");
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled) {
            console.log(result.assets)
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };


    const updateProfile = () => {
        if (email === "" || name === "" || phone === "") {
            setError("KINDLY COMPLETE THE FORM ACCURATELY");
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("isAdmin", false);
        if (password) {
            formData.append("password", password);
        }
        
        if (image) {
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop()
            });
        }
    
        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                setToken(token);
            } catch (error) {
                console.log(error);
            }
        };
        
        getToken();
        console.log(formData)
        console.log('tokenss: ', token)

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        };
    
        axios.put(`${baseURL}users/updateProfile/${user._id}`, formData, config)
            .then((res) => {
                console.log('user', user._id)

                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "PROFILE UPDATED SUCCESSFULLY",
                    });
                    setTimeout(() => {
                        navigation.navigate("User Profile");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    position: 'bottom',
                    bottomOffset: 20,
                    type: "error",
                    text1: "ERROR!",
                    text2: "PLEASE TRY AGAIN",
                });
                console.log(error.message)
            });
            };

  

    

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: mainImage }} />
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Change Picture</Text>
                </TouchableOpacity>
                <Input
                    placeholder={"Name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.userInfoText}
                />
                <Input
                    placeholder={"Email"}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    style={styles.userInfoText}
                />
                <Input
                    placeholder={"Phone Number"}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    style={styles.userInfoText}
                />
                <Input
                    placeholder={"Password"}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.userInfoText}
                />
                {error ? <Error message={error} /> : null}
                <EasyButton
                    primary
                    large
                    onPress={updateProfile}
                    style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>UPDATE</Text>
                </EasyButton>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    userInfoText: {
        marginVertical: 10,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    imagePicker: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
    },
    imagePickerText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    updateButton: {
        backgroundColor: 'gray',
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});


export default UpdateProfile;
