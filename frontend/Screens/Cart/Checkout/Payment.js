import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Radio, Heading, Center, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const methods = [{ name: 'Cash on Delivery', value: 1 }];

const Payment = ({ route }) => {
    const order = route.params;
    const [selected, setSelected] = useState('');
    const navigation = useNavigation();

    return (
        <Center flex={1} bg="lightgray">
            <Heading mt={8} mb={4}>
                Choose your payment method
            </Heading>

            <HStack borderWidth={1} borderRadius={10} borderColor="black" p={4}>
                <Radio.Group name="myRadioGroup" value={selected} onChange={setSelected}>
                    {methods.map((item, index) => (
                        <Radio key={index} value={item.value} my={1} colorScheme="green">
                            {item.name}
                        </Radio>
                    ))}
                </Radio.Group>
            </HStack>

            <View style={{ marginTop: 60 }}>
                <Button title="Confirm" color="black" onPress={() => navigation.navigate('Confirm', { order: order })} />
            </View>
        </Center>
    );
};

export default Payment;
