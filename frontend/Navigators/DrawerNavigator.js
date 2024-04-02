import * as React from "react";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Button,
  Box,
  HamburgerIcon,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
} from "native-base";
import ProductContainer from "../Screens/Product/ProductContainer";
import 'react-native-gesture-handler';
import Login from "../Screens/User/Login";
import Main from "./Main";
import Materials from "./MaterialNavigator"
import Photos from "./PhotoNavigator"
import Users from "./UsersNavigator"

import Cart from "../Screens/Cart/Cart";
import Products from "../Screens/Admin/Products";
import AdminNavigator from "./AdminNavigator";
import ProductList from "../Screens/Product/ProductList";
global.__reanimatedWorkletInit = () => { };
const Drawer = createDrawerNavigator();


const getIcon = (screenName) => {
  switch (screenName) {
    case "HOME":
      return "home-outline";
    case "PROFILE":
      return "account-outline";
        case "PHOTOS":
      return "image-outline";
    case "MATERIALS":
      return "file-document-outline";
    case "USERS":
      return "account-group-outline";
    case "CHARTS":
      return "chart-line"; 
    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="6" my="2" mx="1">
      <Box width={12} height={12} borderRadius="full" overflow="hidden" justifyContent="center" alignItems="center" marginLeft="110">
        <Image
          source={require("../assets/Logo.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
        {/* <Box px="4">
          <Text bold color="gray.700">
            Mail
          </Text>
          <Text fontSize="14" mt="1" color="gray.500" fontWeight="500">
            john_doe@gmail.com
          </Text>
        </Box> */}
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                px="5"
                py="3"
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(0, 0, 0, 0.2)"
                    : "transparent"
                }
                onPress={(event) => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "" : "gray.700"
                    }
                    size="5"
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "" : "white.700"
                    }
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
const DrawerNavigator = () => {
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="HOME"
          component={Main}
        />
        {/* <Drawer.Screen name="Products" component={Main} initialParams={{ screen: 'Products' }} /> */}
        {/* <Drawer.Screen name="PROFILE" component={Main} initialParams={{ screen: 'User' }} /> */}
        {/* <Drawer.Screen name="CART" component={Main} initialParams={{ screen: 'Cart' }} /> */}
        {/* <Drawer.Screen name="Product List" component={Main}  initialParams={{ screen: 'Admin' }}/> */}
        <Drawer.Screen name="PHOTOS" component={Photos}  initialParams={{ screen: 'Photos' }}/>
        <Drawer.Screen name="MATERIALS" component={Materials}  initialParams={{ screen: 'Materials' }}/>
        <Drawer.Screen name="USERS" component={Users}  initialParams={{ screen: 'Users' }}/>
        <Drawer.Screen name="CHARTS" component={''}  initialParams={{ screen: '' }}/>
      </Drawer.Navigator>
    </Box>
  );
}
export default DrawerNavigator