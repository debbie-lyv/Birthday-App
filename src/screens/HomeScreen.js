import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { colors } from '../../colors';

export default function HomeScreen({ navigation }) {
  const { getItem } = useAsyncStorage('birthday');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function getBirthday() {
    getItem()
      .then((birthdayJSON) => {
        const birthday = birthdayJSON ? JSON.parse(birthdayJSON) : [];
        const sortedBirthday = sortDataByMonth(birthday).slice(0, 5); // Sort the data
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

  const formatDate = (birthdate) => {
    const date = new Date(birthdate);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formatter = new Intl.DateTimeFormat(undefined, options);
    return formatter.format(date);
  };

  function daysUntilDate(dateString) {
    // Parse the input date string
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Set the year of the input date to the current year
    inputDate.setFullYear(currentDate.getFullYear());

    // If the input date is before the current date, set its year to the next year
    if (inputDate < currentDate) {
      inputDate.setFullYear(currentDate.getFullYear() + 1);
    }

    // Calculate the difference in milliseconds between the two dates
    const differenceMs = inputDate - currentDate;

    // Convert milliseconds to days
    const daysLeft = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return daysLeft;
  }

  function renderCard({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Profile', { itemId: item.id, imageUri: item.imageUri })}>
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.cardContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.cardSubtitle}>{formatDate(item.birthday)}</Text>
            </View>
          </View>
          <Text style={styles.rightContent}>
            {daysUntilDate(item.birthday) === 0 ? 'TODAY' : `in ${daysUntilDate(item.birthday)} ${daysUntilDate(item.birthday) === 1 ? 'day' : 'days'}`}
          </Text>

        </Card>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getBirthday);
    return unsubscribe;
  }, [navigation])

  return (
    <View>
      <View style={styles.topButton}>
        <TouchableOpacity onPress={() => navigation.navigate('All Birthdays')}>
          <Text style={styles.buttonText}>
            See all birthdays
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.headerText}> Upcoming Birthdays: </Text>
      </View>
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
  cardContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 10
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  rightContent: {
    textAlign: 'right',
    color: colors.backColor
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.backColor
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: colors.backColor
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
    color: colors.backColor,
    marginTop: 30
  },
  topButton: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backColor
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 40,
    padding: 10,
    textAlign: 'center'
  }
});