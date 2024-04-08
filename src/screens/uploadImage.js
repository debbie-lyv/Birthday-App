import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../colors';

export default function UploadImage( {onImageSelected}) {
  const [image, setImage] = useState(null);

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    });
    if (!_image.canceled) {
      console.log(_image.uri);
      setImage(_image.assets[0].uri);
      onImageSelected(_image.assets[0].uri);
    }
  }

  useEffect(() => {
    //checkForCameraRollPermission();
  }, [image]);


  return (
    <View style={styles.uploadImageContainer}>
      <TouchableOpacity onPress={addImage}>
        {image ? (
          <Image source={{ uri: image}} style={styles.uploadImage} />
        ) : (
          <View style={styles.uploadImage}>
            <View style={{ alignItems: "center", marginVertical: 60 }}>
              <Feather name="camera" size={75} color="grey" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    uploadImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
    },
    uploadImage: {
      height: 200,
      width: 200,
      backgroundColor: '#dedede',
      borderRadius: 999,
      overflow: 'hidden',
    },
    text: {
      textAlign: 'center',
      fontSize: 20,
      alignItems: 'center',
      margin: 50
    }
});