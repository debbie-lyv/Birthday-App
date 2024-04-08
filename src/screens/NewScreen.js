import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadImage from './uploadImage';
import { colors } from '../../colors';

export default function NewScreen({ navigation }) {
  const { getItem, setItem } = useAsyncStorage('birthday');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
  
  function newBirthday(values) {
    if (!values.name || !values.birthday) {
      Toast.show({
        type: 'error',
        text1: 'Name and Birthday are required',
        position: 'bottom'
      });
      return;
    }
    //get birthday array from storage
    const newBirthday = {
      id: uuid.v4(),
      name: values.name,
      birthday: selectedDate,
      imageUri: imageUri 
    };
    console.log(newBirthday)

   getItem()
      .then((birthdayJSON) => {
        let birthday = birthdayJSON ? JSON.parse(birthdayJSON) : [];
        //add a new item to the list
        birthday.push(newBirthday);

        //set item in storage again
        setItem(JSON.stringify(birthday))
          .then(() => {
            //navigate back to home screen
            navigation.goBack();
            Toast.show({
              type: 'success',
              text1: 'New birthday added successfully!',
              position: 'bottom'
            });
          }).catch((err) => {
            console.error(err);
            Toast.show({
              type: 'error',
              text1: 'An error occurred and a new birthday could not be saved',
              position: 'top'
            });
          });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'An error occurred and a new birthday could not be saved',
          position: 'bottom'
        });
      });
  }

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', birthday: selectedDate }}
      onSubmit={newBirthday}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <View style = {styles.container}>
          <UploadImage onImageSelected={setImageUri} />
          </View>
          <View>
            <TextInput
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
            />
          </View>
          <View style={styles.datePicker}>
            <DateTimePicker
              value={selectedDate}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          </View>
          <View>
            <Button
              title="Add Birthday"
              onPress={handleSubmit}
              style={styles.button}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 20,
  },
  input: {
    marginTop: 10,
    marginHorizontal: 30,
    padding: 20,
    fontSize: 25,
    backgroundColor: colors.textWhite,
    textAlign: 'center',
    borderRadius: 10,
  },
  button: {
    backgroundColor: colors.backColor,
  },
  datePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    marginHorizontal: 10
  }
})