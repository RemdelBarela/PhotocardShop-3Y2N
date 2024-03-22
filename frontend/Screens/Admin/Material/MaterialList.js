import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import MaterialCard from "./MaterialCard";

var { width } = Dimensions.get("window")

const MaterialList = (props) => {
    const { item } = props;
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("Material Detail", { item: item })
            }>
            <View style={{ width: width / 2, backgroundColor: 'gainsboro' }}>
                <MaterialCard {...item} />
            </View>
        </TouchableOpacity>
    )
}
export default MaterialList