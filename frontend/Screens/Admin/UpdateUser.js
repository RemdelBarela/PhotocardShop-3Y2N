import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, TextInput, Switch, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const Register = () => {
    const navigation = useNavigation();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [launchCam, setLaunchCam] = useState(false);
    const [location, setLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const register = () => {
        console.log()
        if (email === "" || name === "" || phone === "" || password === "") {
            setError("Please fill in the form correctly");
        }
        // let user = {
        //     name: name,
        //     email: email,
        //     password: password,
        //     phone: phone,
        //     isAdmin: false,
        // };
        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("isAdmin", false);
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
        axios
            .post(`${baseURL}users/register`, formData, config)
            .then((res) => {
                if (res.status === 200) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Succeeded",
                        text2: "Please Login into your account",
                    });
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    position: 'bottom',
                    bottomOffset: 20,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
                console.log(error.message)
            });
    }
    const toggleMode = () => {
        // Toggle between login and registration screens
        mode === 'login' ? navigation.navigate("Login") : navigation.navigate("Register");
    };

    const takePicture = async () => {
        setLaunchCam(true)

        const c = await ImagePicker.requestCameraPermissionsAsync();

        if (c.status === "granted") {
            let result = await ImagePicker.launchCameraAsync({
                aspect: [4, 3],
                quality: 0.1,
            });
            console.log(result)

            // setImage(data.uri);
            // setMainImage(data.uri)
            if (!result.canceled) {
                console.log(result.assets)
                setMainImage(result.assets[0].uri);
                setImage(result.assets[0].uri);
            }
        }
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <View style={styles.app}>
                <View style={styles.formBlockWrapper} />
                <View style={[styles.formBlock, styles.isSignup]}>
                    <View style={styles.formBlockHeader}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: mainImage }} />
                            <TouchableOpacity
                                onPress={takePicture}
                                style={styles.imagePicker}>
                                <Icon style={{ color: "white" }} name="camera" />
                            </TouchableOpacity>
                        </View>
                        <Input
                            placeholder={"Email"}
                            name={"email"}
                            id={"email"}
                            onChangeText={(text) => setEmail(text.toLowerCase())}
                        />
                        <Input
                            placeholder={"Name"}
                            name={"name"}
                            id={"name"}
                            onChangeText={(text) => setName(text)}
                        />
                         <Input
                            placeholder={"Password"}
                            name={"password"}
                            id={"password"}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <Input
                            placeholder={"Phone Number"}
                            name={"phone"}
                            id={"phone"}
                            keyboardType={"numeric"}
                            onChangeText={(text) => setPhone(text)}
                        />
                         <Input
                            placeholder={"Address"}
                            name={"address"}
                            id={"address"}
                            onChangeText={(text) => setAddress(text)}
                        />
                        <View style={styles.buttonGroup}>
                            {error ? <Error message={error} /> : null}
                        </View>
                        <EasyButton x-l primary onPress={() =>  register()}>
                            <Text style={{ color: 'white' }}>CONFIRM</Text>
                        </EasyButton>
                    </View>
                </View>
            </View>

        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    app: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formBlockWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    isLogin: {
        opacity: 0.92,
        backgroundColor: '#2C497F',
    },
    isSignup: {
        opacity: 0.94,
        backgroundColor: '#433B7C',
    },
    formBlock: {
        position: 'relative',
        margin: 100,
        width: 285,
        padding: 25,
        backgroundColor: 'rgba(255, 255, 255, .13)',
        borderRadius: 8,
        color: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 16,
        },
        shadowOpacity: 0.07,
        shadowRadius: 9,
        elevation: 10,
    },
    formBlockHeader: {
        marginBottom: 20,
    },
    formBlockToggleBlock: {
        position: 'relative',
    },
    formGroupLogin: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
    },
    formGroupSignup: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
    },
    socialButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        margin: 20,
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
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
});

export default Register;
