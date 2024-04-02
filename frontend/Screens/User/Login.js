import Input from "../../Shared/Form/Input";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Switch, Dimensions } from 'react-native'
import FormContainer from "../../Shared/Form/FormContainer";
import Error from '../../Shared/Error'
import { Button } from "native-base";
import AuthGlobal from '../../Context/Store/AuthGlobal'
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../Context/Actions/Auth.actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = (props) => {
    const [mode, setMode] = useState('login');

    const context = useContext(AuthGlobal)
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")

    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            navigation.navigate("User Profile")
        }
    }, [context.stateUser.isAuthenticated])

    const handleSubmit = () => {
        const user = {
            email,
            password,
        };

        if (email === "" || password === "") {
            setError("INCORRECT PASSWORD OR EMAIL");
        } else {
            loginUser(user, context.dispatch);
            console.log("error")
        }
    }

    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
            stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
            });
        });
    });
    const toggleMode = () => {
        // Toggle between login and registration screens
        mode === 'Register' ? navigation.navigate("Register") : navigation.navigate("Register");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
        >
            <View style={styles.app}>
                <View style={styles.formBlockWrapper} />
                <View style={[styles.formBlock, mode === 'register' ? styles.isSignup : styles.isLogin]}>
                    <View style={styles.formBlockHeader}>
                        <Input
                            placeholder={"Enter Email"}
                            name={"email"}
                            id={"email"}
                            value={email}
                            onChangeText={(text) => setEmail(text.toLowerCase())}
                        />
                        <Input
                            placeholder={"Enter Password"}
                            name={"password"}
                            id={"password"}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />

                        <EasyButton x-l primary onPress={() => handleSubmit()} style={{ backgroundColor: 'black' }}>
                            <Text style={{ color: 'white' }}>LOGIN</Text>
                        </EasyButton>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: -10 }}>
                            <Text>Do not have an account? Register here </Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={mode === 'register' ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleMode}
                                value={mode === 'register'}
                            />
                        </View>


                    </View>
                </View>
            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonGroup: {
        width: "80%",
        alignItems: "center",
    },
    app: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2022',
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
        backgroundColor: '#B6B6B4',
    },
    isSignup: {
        opacity: 0.94,
        backgroundColor: '#B6B6B4',
    },

    formBlockToggleBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    toggleText: {
        marginRight: 10,
    },
    switchContainer: {
        marginLeft: 'auto', // Pushes the switch to the right
    },


    formBlock: {
        position: 'relative',
        margin: 100,
        width: Dimensions.get('window').width - 55, // Adjust width according to your design
        padding: 25,
        height: 300, // Adjust height according to your design
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
});

export default Login;
