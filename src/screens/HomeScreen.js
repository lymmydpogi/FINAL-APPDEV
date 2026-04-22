import React from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMG, ROUTES } from '../utils';
import CustomButton from '../components/CustomButton';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ width: 200, height: 200 }} />

      <Text style={{ fontSize: 20, marginVertical: 20 }}>HomeScreen</Text>

      <CustomButton
        title="GO TO PROFILE"
        onPress={() => navigation.navigate(ROUTES.PROFILE)}
      />
    </View>
  );
};

export default HomeScreen;
