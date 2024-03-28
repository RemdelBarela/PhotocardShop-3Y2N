import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, TextInput, Switch, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import { PermissionsAndroid } from "react-native";
import * as Location from 'expo-location';
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import mime from "mime";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import axios from "axios";

const UpdateProfile = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState(user.address);
    const [isAdmin, setisAdmin] = useState(user.isAdmin);
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState(user.image);

    const updateProfile = () => {
        let formData = new FormData();
        if (image) {
            const newImageUri = "file:///" + image.split("file:/").join("");
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop()
            });
        }
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("address", address);
        if (password) {
            formData.append("password", password);
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }

        axios.put(`${baseURL}users/${user._id}`, formData, config)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Profile updated successfully");
                    navigation.goBack();
                }
            })
            .catch((error) => {
                console.log("Error updating profile:", error);
                setError("Something went wrong. Please try again.");
            });
    };

    const pickImage = async () => {
        // Code to pick image from gallery
    };

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: mainImage }} />
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Icon style={{ color: "white" }} name="camera" />
                </TouchableOpacity>
                <Input
                    placeholder={"Name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input
                    placeholder={"Email"}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Phone Number"}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Password"}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    placeholder={"Address"}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                {error ? <Error message={error} /> : null}
                <EasyButton primary large onPress={updateProfile}>
                    <Text style={{ color: 'white' }}>UPDATE</Text>
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
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    imagePicker: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
    },
});

export default UpdateProfile; 