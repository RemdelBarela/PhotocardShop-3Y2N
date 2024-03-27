import React, { useState, useCallback, useEffect } from "react";
import { TouchableOpacity, View, Dimensions, 
ScrollView, Text, StyleSheet, FlatList, 
Image, Modal} from "react-native";
import {
    VStack, Input, Icon, HStack, Container, 
    Avatar, Box, Spacer,  Center, Heading
} from "native-base";
import Carousel from 'react-native-snap-carousel';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from 'react-redux'
import { addToCart } from '../Redux/Actions/cartActions'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BlurView } from "expo-blur";
import axios from "axios";

import baseURL from "../assets/common/baseurl";
import EasyButton from "../Shared/StyledComponents/EasyButton";

import { images } from "./Product/constants";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [photoList, setPhotoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState();
  const [photoFilter, setPhotoFilter] = useState([]);
  const [token, setToken] = useState();

  const navigation = useNavigation();
  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseURL}photos`)
        .then((res) => {
          setPhotoList(res.data);
          setPhotoFilter(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Error fetching photos:', error);
          setLoading(false);
        });
        
      return () => {
        setPhotoList([]);
        setPhotoFilter([]);
        setLoading(true);
      };
    }, [])
  );

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

  const searchPhoto = (text) => {
    if (text === "") {
      setPhotoFilter(photoList);
    } else {
      setPhotoFilter(
        photoList.filter((i) =>
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const openList = () => {
    setFocus(true);
    }

    const onBlur = () => {
    setFocus(false);
    }

    const handlePhotoSelect = (id) => {
        setShowAddToCartModal(true);
        // Extract the ID of the selected photo and set it
        console.log('Selected Photo ID:', id);
        axios.get(`${baseURL}photos/select/${id}`)
                .then((res) => {
                    setSelectedPhoto(res.data)
                    console.log('Additional details for selected photo:', res.data);
                })
                .catch((error) => {
                    console.log('Error fetching additional details for selected photo:', error);
                });
    };

    const handleMaterialSelect = (id) => {
        axios.get(`${baseURL}materials/select/${id}`)
                .then((res) => {
                    setSelectedMaterial(res.data);
                    console.log('Additional details for selected material:', res.data);
                })
                .catch((error) => {
                    console.log('Error fetching additional details for selected material:', error);
                });
    };
    

    const handleAddToCart = (photo_id, material_id) => {
        console.log("pHOTO: ", photo_id)
        console.log("mAT: ", material_id)

        axios.post(`${baseURL}orders/${photo_id}/${material_id}`)
            .then((res) => {
                console.log('Response:', res);
                if (res.status === 200 || res.status === 201) {
                    axios.get(`${baseURL}orders/photocard/${res.data.photocard._id}`)
                        .then((response) => {
                            const newData = response.data;
                            console.log('newData:', newData);

                            dispatch(addToCart({newData, quantity: 1}));
                        })
                        .catch((error) => {
                            console.log('Error fetching newly added data:', error);
                        });
                } else {
                    console.log('Unexpected response status:', res.status);
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    
        // The rest of your logic goes here
        setSelectedPhoto(null);
        setSelectedMaterial(null);
        setShowAddToCartModal(false);
    };
    

  return (
    <View style={styles.Outercontainer}>
        <VStack w="100%" space={5} alignSelf="center">
            <Input
                onFocus={openList}
                onChangeText={(text) => searchPhoto(text)}
                placeholder="Search"
                variant="filled"
                width="100%"
                borderRadius="10"
                py="1"
                px="2"
                InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />}
                InputRightElement={focus === true ? 
                    <Icon ml="2" size="4" color="gray.400" as={
                        <Ionicons name="close" size="12" color="black" onPress={onBlur} 
                        />} 
                    /> : null}
            />
        </VStack>
        {focus === true ? (
            <Container style={{ width: width }}>
            {photoFilter.length > 0 ? (
                <Box width={80}>
                    <FlatList data={photoFilter} renderItem={({ item }) =>
                        <TouchableOpacity
                        style={{ margin:10, marginBottom: -10, flex: 1, flexDirection: "row" }}
                          onPress={() => {
                            handlePhotoSelect(item._id);
                            setShowAddToCartModal(true);
                        }}
                        >
                            <View style={styles.card}>

                            <Image
                                source={{ uri: item.image[0] }}
                                resizeMode="contain"
                                style={styles.image}
                            />
                               
                                <View style={{  flex: 1.5, justifyContent: 'center' }}>
                                    <Text style={styles.boldText}>{item.name}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>} keyExtractor={item => item._id} 
                    />
                </Box>
            ) : (
                <View style={styles.Searchcenter}>
                    <Text style={{ alignSelf: 'center' }}>
                        NO PHOTOS FOUND
                    </Text>
                </View>
            )}
        </Container>
        ) : (
        <ScrollView>
            {photoFilter.length > 0 ? (
                <View style={styles.listContainer}>
                {photoFilter.map((item) => (
                    <View key={item._id} style={styles.photoListItem}>
                        <View style={{ shadowColor: '#000',
                             shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.05,
                            shadowRadius: 1.65,
                            elevation: 6,  
                            margin:5,
                            borderRadius: 10 ,
                            padding:10, 
                            flex: 1}}
                        >
                                <TouchableOpacity
                                style={{ margin:10, marginBottom: -10, flex: 1, flexDirection: "row" }}
                                  onPress={() => {
                                    handlePhotoSelect(item._id);
                                    setShowAddToCartModal(true);
                                }}
                                >
                                    <View style={styles.card}>

                                    <Image
                                        source={{ uri: item.image[0] }}
                                        resizeMode="contain"
                                        style={styles.image}
                                    />
                                       
                                        <View style={{  flex: 1.5, justifyContent: 'center' }}>
                                            <Text style={styles.boldText}>{item.name}</Text>
                                            <Text style={styles.description}>{item.description}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {selectedPhoto && (
                                    <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={showAddToCartModal}
                                    >
                                        <BlurView
                                            style={styles.blur}
                                            tint="light"
                                            intensity={20}
                                        >
                                            <TouchableOpacity
                                                style={styles.absolute}
                                                onPress={() => {
                                                    setSelectedPhoto(null);
                                                    setSelectedMaterial("");
                                                    setShowAddToCartModal(false);
                                                }}
                                            >
                                            </TouchableOpacity>

                                            <View style={styles.backButtonContainer}>
                                                <TouchableOpacity
                                                    onPress={() => setShowAddToCartModal(false)}
                                                >
                                                    <Text style={styles.backButtonText}>BACK</Text>
                                                </TouchableOpacity>
                                            </View>
                                        
                                            <Center flexGrow={1}>
                                                <ScrollView style={styles.Modalcontainer}>
                                                    <Carousel
                                                        data={selectedPhoto.image}
                                                        renderItem={({ item }) => ( // Change here
                                                            <Image
                                                                source={{ uri: item }} // Change here
                                                                resizeMode="contain"
                                                                style={styles.image}
                                                            />
                                                        )}
                                                        sliderWidth={400}
                                                        itemWidth={300}
                                                        loop={true}
                                                        autoplay={true}
                                                        autoplayInterval={5000}
                                                    />

                                                    <View style={styles.contentContainer}>
                                                        <Heading style={styles.contentHeader}>{selectedPhoto.name}</Heading>
                                                        <Text style={styles.Singledescription}>{selectedPhoto.description}</Text>
                                                    </View>
                                                    <FlatList
                                                        data={materials}
                                                        renderItem={({ item }) => (
                                                            <View style={styles.materialContainer}>
                                                                <TouchableOpacity onPress={() => handleMaterialSelect(item._id)}>
                                                                    <Text style={styles.materialName}>{item.name}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                        keyExtractor={(item) => item._id}
                                                    />

                                                
                                                    {selectedMaterial && (
                                                        <View style={styles.selectedMaterialContainer}>
                                                            <View style={styles.selectedMaterialContent}>
                                                                <Text style={styles.selectedMaterialText}>PRICE: ${selectedMaterial.price}</Text>
                                                                <Text style={styles.selectedMaterialText}>STOCK: {selectedMaterial.countInStock}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    <EasyButton
                                                        primary
                                                        medium
                                                        onPress={() => handleAddToCart(selectedPhoto?._id, selectedMaterial?._id)}
                                                        style={styles.cartButton}
                                                    >
                                                        <Text style={styles.cartButtonText}>ADD TO CART</Text>
                                                    </EasyButton>

                                                </ScrollView>
                                            </Center>
                                        </BlurView>
                                    </Modal>
                                )}
                        </View>
                    </View>
                ))}
                </View>
            ) : (
                <View style={[styles.NoPhotocenter, { height: height / 2 }]}>
                    <Text>NO PHOTO FOUND</Text>
                </View>
            )}
        </ScrollView>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    Outercontainer: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    Searchcenter: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    listContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        justifyContent: "center",
    },
    photoListItem: {
        width: "50%",
        marginBottom: 10,
    },
    NoPhotocenter: {
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    card: {
        flexDirection: 'column',
        width: "100%",
        padding: 10
    },
    image: {
        aspectRatio: 5.5 / 8.5, 
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 10,
        textTransform: 'uppercase', // Transform text to uppercase

    },
    description: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        marginBottom: 15,
    },
    blur: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
    backButtonText: {
        marginTop: 50,
    },
    contentContainer: {
        justifyContent: 'flex-start',
        marginTop:20,
    },
    contentHeader: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 30,
    },
    Singledescription: {
        fontSize: 20,
        color: '#555',
    },
    materialContainer: {
        borderColor: 'black',
        borderWidth: 5,
        marginTop: 20
    }
});



export default Home;
