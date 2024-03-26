import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProductCard = ({ name, description, images }) => {
    return (
        <View style={styles.card}>
            {/* FlatList for rendering multiple images */}
            <FlatList
                horizontal
                data={images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                )}
            />

            <View style={{ flex: 1.5, marginLeft: 10, justifyContent: 'center' }}>
                <Text style={styles.boldText}>
                    {name.length > 15 ? `${name.substring(0, 15)}...` : name}
                </Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: width / 2 - 20,
        height: width / 1.7,
        padding: 10,
        borderRadius: 10,
        marginTop: 55,
        marginBottom: 5,
        marginLeft: 15,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'black',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
    description: {
        fontSize: 14,
        color: 'white',
    },
});

export default ProductCard;
