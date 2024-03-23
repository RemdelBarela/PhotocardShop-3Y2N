import React from 'react';
import { TextInput, StyleSheet } from 'react-native'

const Input = (props) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            name={props.name}
            id={props.id}
            value={props.value}
            autoCorrect={props.autoCorrect}
            onChangeText={props.onChangeText}
            onFocus={props.onFocus}
            secureTextEntry={props.secureTextEntry}
            keyboardType={props.keyboardType}
        >
        </TextInput>
    );
}

const styles = StyleSheet.create({
    input: {
        fontSize: 15,
        color: '#fff',
        width: '100%',
        padding: 14,
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,.25)',
        borderRadius: 8,
    },
});

export default Input;