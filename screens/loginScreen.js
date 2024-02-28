import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {

    const [userName, setUserName] = useState('');

    const handleLogin = async () => {

        try {
            await SecureStore.setItemAsync('userName', userName);
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUserName}
                value={userName}
                placeholder="Entrez votre nom d'utilisateur"
            />
            <Button onPress={handleLogin} title="Se connecter" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});