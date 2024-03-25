import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProductCard from "./ProductCard";
import {
  StyleSheet, 
  Text,
  FlatList, 
  Image,
  Modal,
  TextStyle,
  StyleProp,
} from "react-native";
import { BlurView } from "expo-blur";
import { images, COLORS, SIZES, FONTS } from "./constants";

var { width } = Dimensions.get("window")

const ProductList = (props) => {
  const { item } = props;
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState("");
  const [showAddToCartModal, setShowAddToCartModal] = React.useState(false);

  const navigation = useNavigation();

  function renderSizes() {
    const materials = ["Matt Soft", "Gel", "Paper"];
    return materials.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={{
            width: 35,
            height: 25,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
            marginBottom: 10,
            backgroundColor:
            materials[index] == selectedSize ? COLORS.white : null,
            borderWidth: 1,
            borderColor: COLORS.white,
            borderRadius: 5,
          }}
          onPress={() => {
            setSelectedSize(item);
          }}
        >
          <Text
            style={{
              color:
              materials[index] == materials
                  ? COLORS.black
                  : COLORS.white,
              ...FONTS.body4,
            }}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    });
  }
  console.log(selectedItem);

  return (
    <View style={{    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,  margin:5,borderRadius: 10 ,padding:20, flex: 1, paddingBottom: SIZES.padding }}>
      <TouchableOpacity
        style={{ margin:10, marginBottom: -10, flex: 1, flexDirection: "row" }}
        
    //       onPress={() => {
    //         setSelectedItem(  {  item });
    //     setShowAddToCartModal(true);
    //  }}
       onPress={() => navigation.navigate("Product Detail", { item: item })
       } >

        <ProductCard {...item} />

      </TouchableOpacity>

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddToCartModal}
        >
          <BlurView
            style={style.blur}
            tint="light"
            intensity={20}
          >
            <TouchableOpacity
              style={style.absolute}
              onPress={() => {
                setSelectedItem(null);
                setSelectedSize("");
                setShowAddToCartModal(false);
              }}
            ></TouchableOpacity>
            {/* Modal content */}
            <View
              style={{
                justifyContent: "center",
                width: "85%",
                backgroundColor: selectedItem.bgColor,
              }}
            >
              <View>
                <Image
                  source={selectedItem.image}
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    height: 170,
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: SIZES.padding,
                  marginHorizontal: SIZES.padding,
                  color: COLORS.white,
                  ...FONTS.h2,
                }}
              >
                {selectedItem.name}
              </Text>
              
              <Text
                style={{
                  marginTop: SIZES.base / 2,
                  marginHorizontal: SIZES.padding,
                  color: COLORS.white,
                  ...FONTS.body3,
                }}
              >
                {selectedItem.type}
              </Text>
              <Text
                style={{
                  marginTop: SIZES.radius,
                  marginHorizontal: SIZES.padding,
                  color: COLORS.white,
                  ...FONTS.h1,
                }}
              >
                {selectedItem.price}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: SIZES.radius,
                  marginHorizontal: SIZES.padding,
                }}
              >
                <View>
                  <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                    Select Size
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    flexDirection: "row",
                    marginLeft: SIZES.radius,
                  }}
                >
                  {renderSizes()}
                </View>
              </View>

              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: SIZES.base,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
                onPress={() => {
                  setSelectedItem(null);
                  setSelectedSize("");
                  setShowAddToCartModal(false);
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.largeTitleBold }}>
                  Add To Cart
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      )}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  featuredShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  featuredDetails: {
    position: "absolute",
    top: 160,
    left: 30,
    flexDirection: "column",
    marginLeft: 25,
    marginBottom: 8,
  },
  recentSearchShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  recentSearches: {
    width: "100%",
    transform: [{ rotateY: "180deg" }],
  },
  blur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ProductList