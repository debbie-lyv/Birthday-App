import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Card, Text, SearchBar } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { colors } from '../../colors';

export default function BirthdayList({ navigation }) {
  const { getItem } = useAsyncStorage('birthday');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchItem, setSearchItem] = useState('');

  function getBirthday() {
    getItem()
      .then((birthdayJSON) => {
        const birthday = birthdayJSON ? JSON.parse(birthdayJSON) : [];
        const sortedBirthday = sortDataByMonth(birthday); // Sort the data
        setItems(sortedBirthday); // Set the sorted data to state
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'An error occurred',
          position: 'top'
        });
      });
  }

  const sortDataByMonth = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.birthday);
      const dateB = new Date(b.birthday);
      const monthA = dateA.getMonth();
      const monthB = dateB.getMonth();
      const dayA = dateA.getDate();
      const dayB = dateB.getDate();

      // Sort by month
      if (monthA !== monthB) {
        return monthA - monthB;
      } else {
        // If months are the same, sort by day within the month
        return dayA - dayB;
      }
    });
  };

  // Function to render the search bar component
  function findName() {
    const handleSearch = async (text) => {
      setSearchItem(text);
      // Retrieve items from AsyncStorage
      const birthdayJSON = await getItem();
      const birthday = birthdayJSON ? JSON.parse(birthdayJSON) : [];
      
      // Filter the items based on the search text (item.name)
      const searchData = birthday.filter(item => item.name.includes(text));
  
      // Set the filtered data to state
      setItems(searchData);
      setLoading(false);
    };

    return (
      <SearchBar 
        placeholder='Search name'
        onChangeText={handleSearch} // Pass handleSearch function to onChangeText
        value={searchItem}
        containerStyle = {styles.searchBarContainer}
        inputStyle = {styles.searchBar}
      />
    );
  }


  function renderCard({ item }) {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { itemId: item.id, imageUri: item.imageUri })}>
          <View style={styles.container}>
            <Card containerStyle={styles.leftContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
            </Card>
            <View style={styles.rightContainer}>
              {item.imageUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUri }} style={styles.image} />
                </View>
              ) : (
                <View style={styles.placeholderCircle}>
                  <Text style={styles.placeholderText}> No image Selected </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getBirthday);
    return unsubscribe;
  }, [navigation])

  return (
    <View>
      {findName()}
      <View>
        <FlatList
          refreshing={loading}
          onRefresh={getBirthday}
          style={styles.list}
          data={items}
          renderItem={renderCard}
          keyExtractor={(item) => item.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    margin: 10,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    backgroundColor: colors.backColor,
    borderRadius: 10
  },
  searchBar: {
    borderRadius: 10
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  leftContainer: {
    marginTop: 20,
    width: "50%",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.backColor,
    margin: 20
  },
  rightContainer: {
    right: 0,
    marginTop: 20,
    width: "50%",
    borderRadius: 10
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderCircle: {
    backgroundColor: colors.backGrey,
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});