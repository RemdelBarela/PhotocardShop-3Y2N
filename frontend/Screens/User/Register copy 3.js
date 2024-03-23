import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; // Import GoogleSignin
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import mime from "mime";  
const Register = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [launchCam, setLaunchCam] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        // Configure GoogleSignIn
        GoogleSignin.configure({
            // Replace with your webClientId obtained from Google Cloud Console
            webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
            offlineAccess: false,
        });
    }, []);

    const handleGoogleLoginSuccess = async () => {
        try {
            // Sign in with Google
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            // Continue with registration process using user details
        } catch (error) {
            console.error('Google login error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the login flow
                console.log('Google sign-in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Operation (e.g. sign-in) is in progress already
                console.log('Google sign-in in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // Play services not available or outdated
                console.log('Google Play services not available or outdated');
            } else {
                // Some other error occurred
                console.log('Error:', error);
            }
        }
    };

    const takePicture = async () => {
        setLaunchCam(true);
        const c = await ImagePicker.requestCameraPermissionsAsync();

        if (c.status === "granted") {
            let result = await ImagePicker.launchCameraAsync({
                aspect: [4, 3],
                quality: 0.1,
            });

            if (!result.cancelled) {
                setMainImage(result.uri);
                setImage(result.uri);
            }
        }
    };

    const register = async () => {
        // Your registration logic here
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: mainImage }} />
                <TouchableOpacity onPress={takePicture} style={styles.imagePicker}>
                    <Icon name="camera" size={24} color="white" />
                </TouchableOpacity>
            </View>
            {/* Other input fields */}
            <TouchableOpacity onPress={register} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            {/* Google Login Button */}
            <TouchableOpacity onPress={handleGoogleLoginSuccess} style={styles.googleButton}>
                <Text style={styles.buttonText}>Login with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
