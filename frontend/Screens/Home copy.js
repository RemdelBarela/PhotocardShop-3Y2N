import React, { useState, useCallback, useEffect } from "react";
import {
    TouchableOpacity, View, Dimensions,
    ScrollView, Text, StyleSheet, FlatList,
    Image, Modal
} from "react-native"; import { Alert } from 'react-native';

import {
    VStack, Input, Icon, HStack, Container,
    Avatar, Box, Spacer, Center, Heading
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
// import { images } from "./Product/constants";

const { width, height } = Dimensions.get("window");

const Home = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [photoList, setPhotoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focus, setFocus] = useState();
    const [photoFilter, setPhotoFilter] = useState([]);
    const [token, setToken] = useState();
    const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
    const [reviews, setReviews] = useState([]);

    const dispatch = useDispatch()

    const [backgroundColor, setBackgroundColor] = useState('lightgray');

    const [showAllReviews, setShowAllReviews] = useState(false);

    const handleToggleReviews = () => {
        setShowAllReviews(!showAllReviews);
    };
    
    // useEffect(() => {
    //     // Fetch all reviews from backend
    //     axios
    //       .get(`${baseURL}reviews`)
    //       .then((response) => {
    //         setReviews(response.data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching reviews:", error);
    //       });
    //   }, []);
      
    // useEffect(() => {
    //     if (selectedPhoto) {
    //         axios.get(`${baseURL}photos/${selectedPhoto._id}/reviews`)
    //             .then(response => {
    //                 // Populate the 'user' field to fetch the name of the user who made the review
    //                 const populatedReviews = response.data.map(review => ({
    //                     ...review,
    //                     userName: review.user.name // Assuming 'name' is the field containing the user's name
    //                 }));
    //                 setReviews(populatedReviews);
    //             })
    //             .catch(error => {
    //                 console.log('Error fetching reviews:', error);
    //             });
    //     }
    // }, [selectedPhoto]);
    

    const generateBackgroundColor = () => {
        // Generate a random value between 180 and 230 to produce light shades of gray
        const randomValue = Math.floor(Math.random() * (230 - 180 + 1) + 180);
        // Convert the random value to hexadecimal and pad it with zeros if necessary
        const randomColor = randomValue.toString(16).padStart(2, '0');
        // Return a hexadecimal color in the range of light gray
        return `#${randomColor}${randomColor}${randomColor}`;
    };
    
    // const fetchAllReviews = (photoId) => {
    //     axios.get(`${baseURL}reviews/photo/${photoId}`)
    //         .then(response => {
    //             setReviews(response.data); // Update reviews state with fetched data
    //         })
    //         .catch(error => {
    //             console.log('Error fetching reviews:', error);
    //         });
    // };

    // const fetchReviewsForSelectedPhoto = () => {
    //     if (selectedPhoto) {
    //         axios.get(`${baseURL}photos/${selectedPhoto._id}/reviews`)
    //             .then(response => {
    //                 // Populate the 'user' field to fetch the name of the user who made the review
    //                 const populatedReviews = response.data.map(review => ({
    //                     ...review,
    //                     userName: review.user.name // Assuming 'name' is the field containing the user's name
    //                 }));
    //                 setReviews(populatedReviews);
    //             })
    //             .catch(error => {
    //                 console.log('Error fetching reviews:', error);
    //             });
    //     }
    // };

    // useEffect(() => {
    //     fetchReviewsForSelectedPhoto();
    // }, [selectedPhoto]);
    
    // const handleSeeMoreReviewsButtonClick = () => {
    //     fetchReviewsForSelectedPhoto();
    //     // Additional logic for displaying more reviews if needed
    // };

    // useEffect(() => {
    //     if (selectedPhoto) {
    //         fetchAllReviews(selectedPhoto._id);
    //     }
    // }, [selectedPhoto]);

    const styles2 = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: generateBackgroundColor()
        },
        contentContainer: {
            padding: 20,

            borderRadius: 20,
        },
        contentHeader: {
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'Roboto, Arial, sans-serif', // Specify multiple font families separated by commas
        },
        Singledescription: {
            fontSize: 16,
            marginTop: 10,
            fontFamily: 'Arial, Helvetica, sans-serif', // Specify multiple font families separated by commas
        },


        materialContainer: {
            marginVertical: 10,
            padding: 10,
            backgroundColor: 'lightgray', // Example background color for material container
        },
        materialName: {
            fontSize: 18,
        },
        selectedMaterialContainer: {
            marginVertical: 10,
            padding: 10,
            backgroundColor: 'lightgray', // Example background color for selected material container
        },
        selectedMaterialContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        selectedMaterialText: {
            fontSize: 16,
        },
        cartButton: {
            marginTop: 20,
            alignSelf: 'center',
        },
        cartButtonText: {
            fontSize: 18,
            color: 'white',
        },
    });
    const styles1 = StyleSheet.create({
        imageContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 400,
            margin: 2, // Add margin
            padding: 10, // Add padding
            backgroundColor: 'lightgray',
            borderWidth: 1,
            borderRadius: 22
        },
        image: {
            width: '100%',
            height: '100%',
        },
        modalImage: {
            width: width + 150, // Adjust as needed
            height: width + 150, // Adjust as needed
            resizeMode: 'contain',
        },
    });

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

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
        
        // Axios request to fetch additional details for the selected photo
        axios.get(`${baseURL}photos/select/${id}`)
            .then((res) => {
                setSelectedPhoto(res.data);
                console.log('Additional details for selected photo:', res.data);
    
                // Axios request to fetch reviews for the selected photo
                axios.get(`${baseURL}reviews/photo/${id}`)
                    .then((res) => {
                        console.log('Reviews for selected photo:', res.data);
                        setReviews(res.data);
                    })
                    .catch((error) => {
                        console.log('Error fetching reviews for selected photo:', error);
                    });
            })
            .catch((error) => {
                console.log('Error fetching additional details for selected photo:', error);
            });
    };
    


    const handleMaterialPress = (item, index) => {
        handleMaterialSelect(item._id);
        setSelectedMaterialIndex(index);
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
        if (!selectedMaterial) {
            // If selectedMaterial is not set, show validation message
            Alert.alert('Please select a material', 'SELECT MATERIAL');
            return; // Exit the function without proceeding further
        }

        // Check if the selected material's stock is greater than zero
        if (selectedMaterial.countInStock === 0) {
            // If the stock is zero, display a message
            Alert.alert('Material out of stock', 'SELECT ANOTHER MATERIAL');
            return; // Exit the function without proceeding further
        }

        // Proceed with adding to cart logic
        axios.post(`${baseURL}orders/${photo_id}/${material_id}`)
            .then((res) => {
                console.log('Response:', res);
                if (res.status === 200 || res.status === 201) {
                    axios.get(`${baseURL}orders/photocard/${res.data.photocard._id}`)
                        .then((response) => {
                            const newData = response.data;
                            console.log('newData:', newData);

                            dispatch(addToCart({ newData, quantity: 1 }));
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

        // Reset selectedPhoto and selectedMaterial and close modal
        setSelectedPhoto(null);
        setSelectedMaterial(null);
        setShowAddToCartModal(false);
    };

    // const renderStars = (rating, userRating) => {
    //     const stars = [];
    //     // Push filled stars
    //     for (let i = 1; i <= userRating; i++) {
    //         stars.push('★');
    //     }
    //     // Push empty stars
    //     for (let i = userRating + 1; i <= 5; i++) {
    //         stars.push('☆');
    //     }
    //     return (
    //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //             {stars.map((star, index) => (
    //                 <Text key={index} style={{ color: 'gray', fontSize: 16 }}>{star}</Text>
    //             ))}
    //         </View>
    //     );
    // };

    const renderStars = (ratingId) => {
        console.log('ratingId', ratingId)
        axios.get(`${baseURL}reviews/photo/${ratingId}`)
            .then((res) => {
                console.log('Reviews for selected photo:', res.data);
                // Calculate the average rating
                const averageRating = calculateAverageRating(res.data);
                console.log('Average rating:', averageRating);
                setReviews(res.data);
            })
            .catch((error) => {
                console.log('Error fetching reviews for selected photo:', error);
            });
    
        const calculateAverageRating = (reviews) => {
            if (reviews.length === 0) {
                return 0;
            }
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

            console.log('totalRating: ', totalRating)
            return totalRating / reviews.length;
        };
    
        // Render stars based on average rating
        const stars = [];
        const averageRating = calculateAverageRating(reviews);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= averageRating ? 'star' : i - 1 < averageRating ? 'star-half' : 'star-outline'}
                    size={20}
                    color={i <= averageRating ? 'black' : 'darkgray'}
                />
            );
        }
        return stars;
    };
    
    


    // const reviews = [
    //     { id: 1, user: 'User1', comment: 'Great product!', rating: 5 },
    //     { id: 2, user: 'User2', comment: 'Could be better.', rating: 3 },
    //     // Add more reviews as needed
    // ];

    // const navigation = useNavigation();

    // const navigateToAllReviews = () => {
    //     // Navigate to AllReviewsPage and pass the reviews as a parameter
    //     navigation.navigate('AllReviewsPage', { reviews });
    // };


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
                            <FlatList
                                data={photoFilter}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{ margin: 10, marginBottom: -10, flex: 1, flexDirection: "row" }}
                                        onPress={() => {
                                            // handle your logic here
                                        }}
                                    >
                                        <View style={styles.card}>
                                            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                                <Text style={styles.boldText}>{item.name}</Text>
                                                <Text style={styles.description}>{item.description}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {renderStars(item._id)}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item._id}
                            />
                        </Box>
                    ) : (
                        <View style={styles.Searchcenter}>
                            <Text style={{ alignSelf: 'center' }}>NO PHOTOS FOUND</Text>
                        </View>
                    )}
                </Container>
                ) : (
                <ScrollView>
                    {photoFilter.length > 0 ? (
                        <View style={styles.listContainer}>
                            {photoFilter.map((item) => (
                                <View key={item._id} style={styles.photoListItem}>
                                    <View style={{
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 1.65,
                                        elevation: 6,
                                        margin: 5,
                                        borderRadius: 10,
                                        padding: 10,
                                        flex: 1
                                    }}
                                    >
                                        <TouchableOpacity
                                            style={{ margin: 10, marginBottom: -10, flex: 1, flexDirection: "row" }}
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
                                                <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                                    <Text style={styles.boldText}>{item.name}</Text>
                                                    <Text style={styles.description}>{item.description}</Text>
                                                    <Text>{renderStars(item._id)}</Text>

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
                                                    tint="dark"
                                                    intensity={100}
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
                                                            {/* <Carousel
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
                                                            
                                                            */}
                                                            <Carousel
                                                                data={selectedPhoto.image}
                                                                renderItem={({ item }) => (
                                                                    <TouchableOpacity
                                                                        onPress={() => handleImageClick(item)}
                                                                        style={styles1.imageContainer}
                                                                    >
                                                                        <Image
                                                                            source={{ uri: item }}
                                                                            resizeMode="contain"
                                                                            style={styles1.image}
                                                                        />
                                                                    </TouchableOpacity>
                                                                )}
                                                                sliderWidth={width}
                                                                itemWidth={width * 0.8}
                                                                loop={true}
                                                                autoplay={true}
                                                                autoplayInterval={5000}
                                                            />
                                                            <Modal
                                                                visible={modalVisible}
                                                                transparent={true}
                                                                animationType="fade"
                                                                onRequestClose={() => setModalVisible(false)}
                                                            >
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                                                        <Image
                                                                            source={{ uri: selectedImage }}
                                                                            style={styles1.modalImage}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </Modal>
                                                            <View style={[styles2.container, { backgroundColor }]}>
                                                                <View style={styles2.contentContainer}>
                                                                    <Heading style={styles2.contentHeader}>{selectedPhoto?.name}</Heading>
                                                                    <Text style={styles2.Singledescription}>{selectedPhoto?.description}</Text>
                                                                    {selectedMaterial || materials.length > 0 ? (
                                                                        <View style={styles.selectedMaterialContainer}>
                                                                            <View style={styles.selectedMaterialContent}>
                                                                                <Text style={styles.selectedMaterialText}>PRICE: ₱{materials[selectedMaterialIndex]?.price}</Text>
                                                                                <Text style={styles.selectedMaterialText}>STOCK: {materials[selectedMaterialIndex]?.countInStock}</Text>
                                                                            </View>
                                                                        </View>
                                                                    ) : null}
                                                                </View>

                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                                                    {materials.map((item, index) => (
                                                                        <TouchableOpacity
                                                                            key={item._id}
                                                                            onPress={() => handleMaterialPress(item, index)}
                                                                            style={[
                                                                                styles.materialContainer,
                                                                                index === selectedMaterialIndex && styles.selectedMaterialIndicator,
                                                                                item.countInStock === 0 && { opacity: 0.5 } // Add opacity style when stock is 0
                                                                            ]}
                                                                            // Add disabled prop to disable the TouchableOpacity when stock is 0
                                                                            disabled={item.countInStock === 0}
                                                                        >
                                                                            <Text style={styles.materialName}>{item.name}</Text>
                                                                        </TouchableOpacity>
                                                                    ))}
                                                                </ScrollView>

                                                                <EasyButton
                                                                    primary
                                                                    medium
                                                                    onPress={() => handleAddToCart(selectedPhoto?._id, selectedMaterial?._id)}
                                                                    style={[
                                                                        styles.cartButton,
                                                                    ]}
                                                                >
                                                                    <Text style={[
                                                                        styles.cartButtonText,
                                                                    ]}>
                                                                        ADD TO CART
                                                                    </Text>
                                                                </EasyButton>

                                                                <View style={styles.container}>
                                                                        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                                                                            <View style={styles.reviewsContainer}>
                                                                                {/* Display all reviews if showAllReviews is true */}
                                                                                {showAllReviews && (
                                                                                    <View style={styles.reviewsBox}>
                                                                                    <Text style={styles.reviewHeader}>PHOTO REVIEWS</Text>
                                                                                    {reviews.map(review => (
                                                                                        <View key={review.id} style={styles.reviewItem}>
                                                                                            {/* <Text style={styles.reviewUser}>User: {review.userName}</Text> */}
                                                                                            <View style={styles.ratingContainer}>
                                                                                                <Text style={styles.reviewRating}>Rating: </Text>
                                                                                                <View style={styles.starsContainer}>{renderStars(review.rating)}</View>
                                                                                            </View>
                                                                                            <Text style={styles.reviewComment}>Comment: {review.comment}</Text>
                                                                                        </View>
                                                                                    ))}
                                                                                </View>
                                                                                )}

                                                                                {/* Button to toggle between displaying all reviews and hiding them */}
                                                                                <TouchableOpacity onPress={handleToggleReviews} style={styles.seeMoreButton}>
                                                                                    <Text style={styles.seeMoreButtonText}>{showAllReviews ? 'HIDE REVIEWS' : 'SEE REVIEWS'}</Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </ScrollView>
                                                                    </View>
                                                                </View>
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

    cartButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        marginLeft: 55,
        marginTop: 25, 
    },
    cartButtonText: {
        color: 'white',
        fontSize: 16, 
        fontWeight: 'bold',
    },

    image: {
        aspectRatio: 5.5 / 8.5,
    },
    selectedMaterialIndicator: {
        borderWidth: 2,
        borderColor: 'black',

        backgroundColor: 'lightgray'
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
        marginTop: 20,
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
    seeMoreButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    seeMoreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    materialContainer: {
        width: 150,
        padding: 5,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    materialName: {
        textAlign: 'center',
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    reviewsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    reviewsBox: {
        width: '80%',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
    },
    reviewItem: {
        marginBottom: 40,
    },
    reviewUser: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    reviewRating: {
        marginRight: 5,
        fontWeight: 'bold',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontStyle: 'italic',
    },
    seeMoreButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    seeMoreButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reviewHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default Home;