import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Button,KeyboardAvoidingView,StyleSheet, Dimensions, SafeAreaView } from 'react-native'
import { Select, Item, Picker, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import FormContainer from '../../../Shared/Form/FormContainer'
import Input from '../../../Shared/Form/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import AuthGlobal from "../../../Context/Store/AuthGlobal"

const countries = require("../../../assets/data/countries.json");
import SelectDropdown from 'react-native-select-dropdown'

const Checkout = (props) => {
    const [user, setUser] = useState('')
    const [orderItems, setOrderItems] = useState([])
    const [street, setStreet] = useState('')
    const [barangay, setBarangay] = useState('')
    const [city, setCity] = useState('')
    const [zip, setZip] = useState('')
    const [country, setCountry] = useState('Philippines')
    const [phone, setPhone] = useState('')

    const navigation = useNavigation()
    const cartItems = useSelector(state => state.cartItems)
    const context = useContext(AuthGlobal);

    useEffect(() => {
        setOrderItems(cartItems)
        if(context.stateUser.isAuthenticated) {
            setUser(context.stateUser.user.userId)
        } else {
            navigation.navigate("User",{ screen: 'Login' });
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please Login to Checkout",
                text2: ""
            });
        }
        return () => {
            setOrderItems();
        }
    }, [])

    const checkOut = () => {
        console.log("orders", orderItems)
        let order = {
            barangay,
            city,
            country,
            dateOrdered: Date.now(),
            orderItems,
            phone,
            street,
            user,
            zip,
        }
        console.log("ship", order)
        navigation.navigate("Payment", { order: order })
    }
    console.log(orderItems)
    return (

        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
              <FormContainer bg="lightgray" title={"Shipping Address"}>
           <View style={styles.app}>
                <View style={styles.formBlockWrapper} />
                <View style={[styles.formBlock,   styles.isLogin]}>
                <View style={styles.formBlockHeader}>
                    <Input
                    placeholder={"Phone"}
                    name={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Street"}
                    name={"street"}
                    value={street}
                    onChangeText={(text) => setStreet(text)}
                />
                <Input
                    placeholder={"Barangay"}
                    name={"barangay"}
                    value={barangay}
                    onChangeText={(text) => setBarangay(text)}
                />
                <Input
                    placeholder={"City"}
                    name={"city"}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <Input
                    placeholder={"Zip Code"}
                    name={"zip"}
                    value={zip}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setZip(text)}
                />
                <Select
                    width="80%"
                    iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
                    style={{ width: undefined }}
                    selectedValue={country}
                    placeholder="Select your country"
                    placeholderStyle={{ color: '#007aff' }}
                    placeholderIconColor="#007aff"
                    onValueChange={(e) => setCountry(e)}

                >
                    {countries.map((c) => {
                        return <Select.Item
                            key={c.code}
                            label={c.name}
                            value={c.name}
                        />
                    })}
                </Select>
               
                <View style={{ width: '80%', alignItems: "center" }}>
                    <Button title="Confirm" onPress={() => checkOut()} />
                    </View></View></View></View>
            </FormContainer>
        
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
    formBlock: {
        position: 'relative',
        margin: 100,
        width: Dimensions.get('window').width - 100, // Adjust width according to your design
        padding: 25,
        height: 500, // Adjust height according to your design
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
export default Checkout;