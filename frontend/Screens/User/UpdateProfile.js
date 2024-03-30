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
    const [isAdmin, setisAdmin] = useState(user.isAdmin);
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState(user.image);

    const updateProfile = () => {
        // Function to update profile
    };

    const pickImage = async () => {
        // Function to pick image from gallery
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
                {error ? <Error message={error} /> : null}
                <EasyButton primary large onPress={updateProfile}>
                    <Text style={{ color: 'black' }}>UPDATE</Text>
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