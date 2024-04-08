import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../colors';

export default function Profile({ route, navigation }) {
    const { itemId } = route.params;
    const { imageUri } = route.params;
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                // Retrieve data from AsyncStorage
                const jsonValue = await AsyncStorage.getItem('birthday');

                // Parse the JSON string to get the array of birthday objects
                const birthdayArray = jsonValue ? JSON.parse(jsonValue) : [];

                // Find the birthday object with the matching itemId
                const itemData = birthdayArray.find(item => item.id === itemId);

                // Set the profile data state
                setProfileData(itemData);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        getProfileData();
    }, [itemId]);

    const formatDate = (birthdate) => {
        const date = new Date(birthdate);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: "numeric" };
        const formatter = new Intl.DateTimeFormat(undefined, options);
        return formatter.format(date);
    };

    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        // Check if the birthday has occurred this year
        const hasBirthdayOccurred = (today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate()));

        // If the birthday has not occurred yet this year, decrement age
        if (!hasBirthdayOccurred) {
            age--;
        }

        return age;
    };


    const deleteItem = async () => {
        // Show confirmation pop-up
        Alert.alert(
            'Delete Profile',
            'Are you sure you want to delete this profile?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            // Retrieve the entire "birthday" item from AsyncStorage
                            const birthdayData = await AsyncStorage.getItem('birthday');
                            // Parse the JSON data to an array
                            const birthdayArray = JSON.parse(birthdayData);

                            // Find the index of the item to be deleted
                            const index = birthdayArray.findIndex(item => item.id === itemId);
                            if (index !== -1) {
                                // Remove the item from the array
                                birthdayArray.splice(index, 1);
                                // Update the AsyncStorage item with the modified array
                                await AsyncStorage.setItem('birthday', JSON.stringify(birthdayArray));

                                // Navigate back to previous screen or any other action
                                navigation.goBack();
                            } else {
                                console.log('Item not found:', itemId);
                            }
                        } catch (error) {
                            console.error('Error deleting item:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.container}>
            {imageUri ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>
            ) : (
                <View style={styles.placeholderCircle} >
                    <Text style={styles.title}> No image Selected </Text>
                </View>
            )}
            {profileData ? (
                <View>
                    <View style={styles.info}>
                        <Text style={styles.title}>{profileData.name}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>{formatDate(profileData.birthday)}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>Age: {calculateAge(profileData.birthday)}</Text>
                    </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )
            }
            <View style={styles.deleteButtonContainer}>
                <TouchableOpacity onPress={deleteItem}>
                    <View style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 999,
        overflow: 'hidden',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderCircle: {
        backgroundColor: colors.backGrey,
        width: 200,
        height: 200,
        borderRadius: 999,
        overflow: 'hidden',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    info: {
        marginTop: 10,
        padding: 15,
        fontSize: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        color: colors.backColor
    },
    deleteButtonContainer: {
        position: 'relative',
        bottom: -100,
        width: '100%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: colors.warning,
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});