import React, { useState } from 'react'
import { View, Button, Pressable, FlatList, TouchableOpacity, Dimensions, } from 'react-native'
import {
    Container,
    Text,
    Radio,
    Right,
    Left,
    Picker,
    Box,
    HStack,
    VStack,
    Heading,
    Divider,
    CheckCircleIcon,
    Select,
    CheckIcon,
    Center,

} from 'native-base';

import { useNavigation } from '@react-navigation/native';

const methods = [
    { name: 'Cash on Delivery', value: 1 }
]

const Payment = ({ route }) => {

    const order = route.params;
    const [selected, setSelected] = useState('');
    console.log(order)
    const navigation = useNavigation()
    return (
        <Center  >
            <Heading>
                <Text>Choose your payment method</Text>
            </Heading>

            <HStack bg="red.200" width="100%"  >
                <Radio.Group
                    name="myRadioGroup"
                    value={selected}
                    onChange={(value) => {
                        setSelected(value);
                    }}

                >
                    {console.log(selected)}
                    {methods.map((item, index) => {
                        return (
                            <Radio
                                key={index}
                                value={item.value} my="1"
                                colorScheme="green"
                                size="22"
                                style={{ float: 'right' }}
                                icon={<CheckCircleIcon size="22" mt="0.5" color="emerald.500" />}

                            >
                                {item.name}
                            </Radio>
                        )
                    })
                    }
                </Radio.Group>
            </HStack>
            
            <View style={{ marginTop: 60, alignSelf: 'center' }}>
                <Button
                    title={"Confirm"}
                    onPress={() => navigation.navigate("Confirm", { order: order })} />
            </View>
        </Center>
    )
}
export default Payment;