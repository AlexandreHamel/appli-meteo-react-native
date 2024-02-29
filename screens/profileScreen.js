import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ProfileScreen = ({ navigation }) => {

    const [userName, setUserName] = useState('');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const getUsername = async () => {
            const userName = await SecureStore.getItemAsync('userName');
            setUserName(userName);
        };
        getUsername();
    }, []);

    const handlePseudoChange = async () => {
        try {
            await SecureStore.setItemAsync('userName', newName);
            navigation.navigate('Home');
            // console.log(newName);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.text}>Changer de Pseudo:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNewName}
                value={newName}
                placeholder={userName}
            />
            <Button
                style={styles.button}
                onPress={handlePseudoChange}
                title="Valider"
            />
            <Navbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#057CCB',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        margin: 20,
        fontWeight: 'bold',
        color: 'skyblue'
    },
    text: {
        fontSize: 20,
        margin: 3,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
});

export default ProfileScreen;