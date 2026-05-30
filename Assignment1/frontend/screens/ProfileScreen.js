import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../style';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');  // name ke liye state
  const [age, setAge] = useState('');    // age ke liye state
  const [liveData, setLiveData] = useState('');  // live data dikhane ke liye

  // jab bhi name change ho
  const handleNameChange = (text) => {
    setName(text);
    setLiveData(`Name: ${text || '?'}, Age: ${age || '?'}`);
  };

  // jab bhi age change ho
  const handleAgeChange = (text) => {
    setAge(text);
    setLiveData(`Name: ${name || '?'}, Age: ${text || '?'}`);
  };

  return (
    <ScrollView style={[globalStyles.container, globalStyles.lightContainer]}>
      <Text style={[globalStyles.title, globalStyles.lightTitle]}>
        👤 Profile
      </Text>

      {/* profile image - online URL se */}
        <Image
        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
        style={globalStyles.profileImage}
      />
      {/* card mein inputs */}
      <View style={globalStyles.card}>
        {/* Name input */}
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Your Name:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={handleNameChange}
          inputMode="text"
        />

        {/* Age input - sirf numbers */}
        <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 15 }}>
          Your Age:
        </Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={handleAgeChange}
          keyboardType="numeric"  // sirf numbers
          inputMode="numeric"
          maxLength={3}
        />

        {/* live data show karo */}
        {liveData !== '' && (
          <View style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#e3f2fd',
            borderRadius: 10,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Live Data:
            </Text>
            <Text style={{ fontSize: 16, marginTop: 5 }}>
              {liveData}
            </Text>
          </View>
        )}
      </View>

      {/* back button */}
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;