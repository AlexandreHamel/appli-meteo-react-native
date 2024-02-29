import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Button, TextInput, View, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import Navbar from '../components/navbar';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {

    const API_KEY = 'fc315393fd10ea889675ba53a3d77684';

    const [city, setCity] = useState('');
    const [tempCity, setTempCity] = useState('');
    const [weathers, setWeathers] = useState(null);
    const [location, setLocation] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const getUsername = async () => {
            const userName = await SecureStore.getItemAsync('userName');
            setUserName(userName);
            // console.log(userName);
        };
        getUsername();
    }, []);

    useEffect(() => {
        if (city === '') {
            return;
        }
        fetchWeather();
    }, [city]);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
        try {
            const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&limit=1&appid=fc315393fd10ea889675ba53a3d77684`;
            const response = await axios.get(reverseGeoUrl);
            if (response.data && response.data.length > 0) {
                const cityName = response.data[0].name;
                setCity(cityName);
            }
        } catch (error) {
            console.error('Error fetching city:', error);
        }
    }

    const fetchWeather = async () => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`;
            const response = await axios.get(url);
            setWeathers(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const handleCityChange = (text) => {
        setTempCity(text);
    };

    const handleButtonPress = () => {
        setCity(tempCity);
        setTempCity('');
    };

    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcome}>
                <Text style={styles.text}>Bienvenue, {userName}!</Text>
            </View>
            <View style={styles.search}>
                <TextInput
                    style={styles.input}
                    onChangeText={handleCityChange}
                    value={tempCity}
                    placeholder='Entrez le nom de la ville'
                />
                <TouchableOpacity onPress={handleButtonPress}>
                    <AntDesign name="search1" size={35} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.city}>{city}</Text>

            <View style={styles.box}>
                <Text style={styles.temp}>{weathers ? weathers.main.temp.toFixed(1) : ''}°C</Text>
                {weathers && weathers.weather && weathers.weather[0] &&
                    <Image
                        source={{ uri: getWeatherIconUrl(weathers.weather[0].icon) }}
                        style={{ width: 150, height: 150 }}
                    />
                }
            </View>
            <Text style={styles.description}>{weathers ? weathers.weather[0].description : ''}</Text>
            <View style={styles.box}>
                <Text style={styles.min}> {weathers ? weathers.main.temp_min.toFixed(1) : ''}°C</Text>
                <Text style={{ color: 'white' }}> /</Text>
                <Text style={styles.max}> {weathers ? weathers.main.temp_max.toFixed(1) : ''}°C</Text>

                {/* <Text style={styles.text}>Humidité: {weathers ? weathers.main.humidity : ''} %</Text> */}
            </View>

            <Navbar />
            <StatusBar style="auto" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#057CCB',
        alignItems: 'center',
        // justifyContent: 'center',
        color: 'white'
    },
    welcome: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // marginLeft: 16,
        marginTop: 10,
        // marginBottom:20 ,
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 50,
        // position: 'absolute',
        // top: 40,

    },
    city: {
        fontSize: 50,
        color: 'white',
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    temp: {
        fontSize: 70,
        margin: 20,
        color: 'white'
    },
    description: {
        textTransform: 'capitalize',
        fontSize: 20,
        color: 'white',
        fontSize: 30
    },
    max: {
        color: 'orange',
        fontSize: 16,
    },
    min: {
        color: 'blue',
        fontSize: 16,
    },
    text: {
        fontSize: 20,
        color: 'white'
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        margin: 20,
        paddingHorizontal: 10,
        width: '70%',
    },
    button: {
        borderRadius: 20,
    }
});

export default HomeScreen;