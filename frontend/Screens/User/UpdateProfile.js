import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

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

    const updateProfile = () => {
        console.log("Updating profile...");
        let formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        if (password) {
            formData.append("password", password);
        }
        
        if (image) {
            formData.append("image", {
                uri: image,
                name: "profile_image.jpg", // Change the name as per your server's requirements
                type: "image/jpeg", // Change the type if needed
            });
        }
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
    
        axios.put(`${baseURL}users/${user._id}`, formData, config)
    .then((res) => {
        if (res.status === 200) {
            console.log("Profile updated successfully");
            navigation.goBack(); // Navigate back to the previous screen after successful update
        }
    })
    .catch((error) => {
        console.log("Error updating profile:", error);
        setError("Something went wrong. Please try again.");
    });
    };

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access media library is required!");
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

        if (!result.cancelled) {
            setImage(result.uri);
            setMainImage(result.uri);
        }
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
