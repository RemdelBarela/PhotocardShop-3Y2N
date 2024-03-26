import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button } from "react-native";
import { Left, Right, Container, H1, Center, Heading } from 'native-base'
import EasyButton from "../../Shared/StyledComponents/EasyButton"
import TrafficLight from '../../Shared/StyledComponents/TrafficLight'
import axios from 'axios';
import baseURL from "../../assets/common/baseurl";
// import { RadioButton } from "@react-native-paper/radio-button"; // Import RadioButton
import { TouchableOpacity } from 'react-native';

const SingleProduct = ({ route }) => {
    const [item, setItem] = useState(route.params.item);
    // console.log(item)
    const [availability, setAvailability] = useState('')
    const [availabilityText, setAvailabilityText] = useState("")
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        // Fetch materials when component mounts
        axios
            .get(`${baseURL}materials`)
            .then((res) => {
                // Ensure that res.data is an array before setting materials
                if (Array.isArray(res.data)) {
                    setMaterials(res.data);
                } else {
                    console.error('Materials data is not an array:', res.data);
                }
            })
            .catch((error) => {
                console.log('Error fetching materials:', error);
            });
    }, []);
 
    return (
        <Center flexGrow={1}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View style={styles.imageContainer}>
                    {/* Display multiple images */}
                    {item.images.map((imageUrl, index) => (
                        <Image
                            key={index}
                            source={{ uri: imageUrl }}
                            resizeMode="contain"
                            style={styles.image}
                        />
                    ))}
                </View> 
                <View style={styles.availabilityContainer}>
                    {/* <View style={styles.availability}>
                        <Text>
                            Availability: {availabilityText}
                        </Text>
                        {availability}
                    </View> */}
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader} size='xl'>{item.name}</Heading>
                    {/* <Text style={styles.contentText}>{item.brand}</Text> */}
                    <Text>Photo Description: {item.description}</Text>
                </View>
                <Text>Materials:</Text>
                <ScrollView>
                    {materials.map((material, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => setMaterials(material.id)}
                        >
                            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, marginRight: 10, borderColor: materials === material.id ? 'blue' : 'gray' }} />
                            <Text>{material.name}</Text>
                            <Text>{material.description}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                </View>
                <EasyButton
                    primary
                    medium
                >
                    <Text style={{color: "white" }}>ADD TO CART</Text>
                </EasyButton>
            </ScrollView>
        </Center >
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        marginTop: -50,
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentContainer: {
        marginTop: -50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    price: {
        fontSize: 24,
        margin: 20,
        color: 'red'
    },
    availabilityContainer: {
        marginTop:20,
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
    }
})

export default SingleProduct
