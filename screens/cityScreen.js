import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Navbar from '../components/navbar';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const CityScreen = () => {

    const API_KEY = 'fc315393fd10ea889675ba53a3d77684';

    const [userName, setUserName] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [favoriteCities, setFavoriteCities] = useState([]);
    const [cityWeatherData, setCityWeatherData] = useState([]);

    useEffect(() => {
        const getUsername = async () => {
            const userName = await SecureStore.getItemAsync('userName');
            setUserName(userName);
        };
        getUsername();
    }, []);

    useEffect(() => {
        loadFavoriteCities();
    }, [userName]);

    useEffect(() => {
        loadWeatherData(favoriteCities);
    }, [favoriteCities]);

    const loadFavoriteCities = async () => {
        try {
            const cities = await SecureStore.getItemAsync(`${userName}_favoriteCities`);
            if (cities) {
                setFavoriteCities(JSON.parse(cities));
                console.log(cities);
            }
        } catch (error) {
            console.error('Error loading favorite cities:', error);
        }
    };

    const loadWeatherData = async (cities) => {
        try {
            const promises = cities.map(city => {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`;
                return axios.get(url);
            });
            const responses = await Promise.all(promises);
            console.log(responses);
            const weatherData = responses.map(response => ({
                city: response.data.name,
                temp: response.data.main.temp,
                icon: response.data.weather[0].icon,
            }));
            setCityWeatherData(weatherData);
        } catch (error) {
            console.error('Error loading weather data:', error);
        }
    }

    // JSON.parse() prend une chaîne JSON et la transforme en un objet JavaScript.
    // JSON.stringify() prend un objet JavaScript et le transforme en une chaîne JSON.
    // SecureStrore stock seulement en JSON

    const addCity = async () => {
        try {
            if (cityInput.trim() === '') {
                return;
            }
            const updatedCities = [...favoriteCities, cityInput];
            setFavoriteCities(updatedCities);
            await SecureStore.setItemAsync(`${userName}_favoriteCities`, JSON.stringify(updatedCities));
            setCityInput('');
            console.log(favoriteCities);
        } catch (error) {
            console.error('Error adding city:', error);
        }
    };

    const removeCity = async (cityToRemove) => {
        try {
            const updatedCities = favoriteCities.filter(city => city !== cityToRemove);
            setFavoriteCities(updatedCities);
            await SecureStore.setItemAsync(`${userName}_favoriteCities`, JSON.stringify(updatedCities));
        } catch (error) {
            console.error('Error removing city:', error);
        }
    };

    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Favoris</Text>
            <TextInput
                style={styles.input}
                onChangeText={setCityInput}
                value={cityInput}
                placeholder='Entrez le nom de la ville'
            />
            <Button
                style={styles.button}
                onPress={addCity}
                title="Ajouter la ville"
            />

            <FlatList
                data={cityWeatherData}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.city}</Text>
                        <Text>{item.temp.toFixed(1)}°C</Text>
                        <Image 
                            source={{ uri: getWeatherIconUrl(item.icon) }}
                            style={{ width: 50, height: 50 }}
                        />
                        <TouchableOpacity onPress={() => removeCity(item)}>
                            <AntDesign name="delete" size={22} color="darkred" />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <Navbar />
        </SafeAreaView>
    );
};

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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        padding: 20,
        width: '100%',
        backgroundColor: 'white'
    },
});

export default CityScreen;