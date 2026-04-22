import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { IMG } from '../utils';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderWidth: 3,
        borderColor: 'blue',
      }}
    >
      <Image source={{ uri: IMG.LOGO }} style={{ width: 200, height: 200 }} />

      <Text style={{ fontSize: 40, marginVertical: 20 }}>ProfileScreen</Text>

      <CustomTextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />

      <CustomTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />

      <CustomButton
        title="SAVE CHANGES"
        onPress={() => alert(`Saved: ${name}, ${email}`)}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default ProfileScreen;
