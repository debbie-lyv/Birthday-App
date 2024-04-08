import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import NewScreen from './src/screens/NewScreen';
import Profile from './src/screens/Profile';
import BirthdayList from './src/screens/BirthdayList';
import { colors } from './colors';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.backColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20
          }
        }}
        initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Icon
                name="plus"
                type="feather"
                color="#fff"
                style={style.headerIcon}
                onPress={() => navigation.navigate('New Birthday')}
              />
            )
          })}
        />
        <Stack.Screen
          name="New Birthday"
          component={NewScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="home"
                type="feather"
                color="#fff"
                style={style.headerIcon}
                onPress={() => navigation.navigate('Home')}
              />
            )
          })}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="arrow-left"
                type="feather"
                color="#fff"
                style={style.headerIcon}
                onPress={() => navigation.goBack()}
              />
            )
          })}
        />
        <Stack.Screen
  name="All Birthdays"
  component={BirthdayList}
  options={({ navigation }) => ({
    headerLeft: () => (
      <Icon
        name="home"
        type="feather"
        color="#fff"
        style={style.headerIcon}
        onPress={() => navigation.navigate('Home')}
      />
    ),
    headerRight: () => (
      <Icon
        name="plus"
        type="feather"
        color="#fff"
        style={style.headerIcon}
        onPress={() => navigation.navigate('New Birthday')}
      />
    )
  })}
/>

      </Stack.Navigator>
      <Toast ref={(references) => Toast.setRef(references)} />
    </NavigationContainer>
  );
}


const style = StyleSheet.create({
  headerIcon: {
    marginRight: 20,
    marginLeft: 20
  }
});