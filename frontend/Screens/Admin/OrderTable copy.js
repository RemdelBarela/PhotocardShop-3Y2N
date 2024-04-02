import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Center, Heading } from 'native-base';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from 'axios';
import baseURL from "../../assets/common/baseurl";
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../../Redux/Actions/cartActions'; // Import addToCart action

const SingleProduct = ({ route }) => {
    const dispatch = useDispatch();
    const [item, setItem] = useState(route.params.item);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Fetch materials when component mounts
        axios
            .get(`${baseURL}materials`)
            .then((res) => {
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

    const handleAddToCart = () => {
        if (selectedMaterial) {
            dispatch(addToCart(selectedMaterial)); // Dispatch addToCart action with selectedMaterial as payload
            setSelectedMaterial(null); // Clear selected material after adding to cart
        }
    };

    return (
        <Center flexGrow={1}>
            <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                    {/* Display multiple images */}
                    {item.images && item.images.map((imageUrl, index) => (
                        <Image
                            key={index}
                            source={{ uri: imageUrl }}
                            resizeMode="contain"
                            style={styles.image}
                        />
                    ))}
                </View> 
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader} size='xl'>{item.name}</Heading>
                    <Text style={styles.description}>Photo Description: {item.description}</Text>
                </View>
                <Text style={styles.sectionTitle}>Materials:</Text>
                <ScrollView>
                    {materials.map((material, index) => (
                        <View key={index} style={styles.materialContainer}>
                            <Text style={styles.materialName}>{material.name}</Text>
                            <Text style={styles.materialPrice}>Price: ${material.price}</Text>
                            <Text style={styles.materialStock}>Stock: {material.countInStock}</Text>
                            <EasyButton
                                primary
                                medium
                                onPress={() => setSelectedMaterial(material)}
                                disabled={material.countInStock === 0} // Disable button if out of stock
                                style={[styles.selectButton, material.countInStock === 0 ? styles.disabledButton : null]} // Apply custom style for disabled button
                            >
                                <Text style={styles.selectButtonText}>SELECT MATERIAL</Text>
                            </EasyButton>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
            {selectedMaterial && (
                <View style={styles.selectedMaterialContainer}>
                    <View style={styles.selectedMaterialContent}>
                        <Text style={styles.selectedMaterialText}>Selected Material: {selectedMaterial.name}</Text>
                        {/* <Text style={styles.selectedMaterialText}>Price: ${selectedMaterial.price}</Text> */}
                        {/* <Text style={styles.selectedMaterialText}>Stock: {selectedMaterial.countInStock}</Text> */}
                    </View>
                </View>
            )}
            <EasyButton
                primary
                medium
                onPress={handleAddToCart}
                style={styles.cartButton}
            >
                <Text style={styles.cartButtonText}>ADD TO CART</Text>
            </EasyButton>
        </Center>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    imageContainer: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
    },
    contentContainer: {
        marginBottom: 20,
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    materialContainer: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    materialName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    materialPrice: {
        marginBottom: 5,
    },
    materialStock: {
        marginBottom: 10,
    },
    selectButton: {
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginLeft: 30,
        width:150,
    },
    selectButtonText: {
        color: '#fff',
    },
    disabledButton: {
        backgroundColor: '#dddddd',
        opacity: 0.6, 
    },
    selectedMaterialContainer: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 20
    },
    selectedMaterialContent: {
        padding: 10,
    },
    selectedMaterialText: {
        marginTop: 5,
        backgroundColor: 'black',
        color: 'white',
    },
    cartButton: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
    },
    cartButtonText: {
        color: '#fff',
    },
});

export default SingleProduct;