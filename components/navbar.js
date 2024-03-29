import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {

    const navigation = useNavigation();

    const rediretToHome = async () => {
        navigation.navigate('Home');
    }

    const redirectToCity = async () => {
        navigation.navigate('Favoris');
    }

    const redirectToProfile = async () => {
        navigation.navigate('Profile');
    }

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userName');
        console.log('logout');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.navbarContainer}>

            <TouchableOpacity onPress={rediretToHome}>
                <AntDesign name="home" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={redirectToCity}>
                <AntDesign name="pluscircleo" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={redirectToProfile}>
                <AntDesign name="user" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
                <AntDesign name="logout" size={35} color="white" />
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center', 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 50,
        backgroundColor: '#057CCB',
    },
});

export default Navbar;