import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const handleSignOut = async () => {
        await AsyncStorage.removeItem("jwt");
        navigation.navigate("Login");
    };

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ uri: mainImage }} />
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        <Text style={styles.imagePickerText}>Change Picture</Text>
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
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    {error ? <Error message={error} /> : null}
                </View>
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
        paddingHorizontal: 20,
    },
    signOutButton: {
        alignSelf: 'flex-end',
        marginTop: 20,
        marginRight: 20,
    },
    signOutButtonText: {
        color: 'red',
        fontWeight: 'bold',
    },
    userInfoContainer: {
        alignItems: "center",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    imagePicker: {
        marginBottom: 20,
    },
    imagePickerText: {
        color: 'blue',
    },
});

export default UpdateProfile;
