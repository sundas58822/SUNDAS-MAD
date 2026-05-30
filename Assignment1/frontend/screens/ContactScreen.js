import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // icons ke liye
import globalStyles from '../../style';

const ContactScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');  // email state

  // submit button press
  const handleSubmit = () => {
    // agar email empty hai
    if (!email) {
      Alert.alert('Error', 'Please enter your email!');
      return;
    }

    // email valid hai? (@ aur . hona chahiye)
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email!');
      return;
    }

    // sab sahi hai to success alert
    Alert.alert(
      'Success! 🎉',
      `Thank you for contacting us!\nWe'll reach you at: ${email}`,
      [
        { text: 'OK' }
      ]
    );
    
    setEmail('');  // input clear
  };

  return (
    <ScrollView style={[globalStyles.container, globalStyles.lightContainer]}>
      <Text style={[globalStyles.title, globalStyles.lightTitle]}>
        📧 Contact Us
      </Text>

      <View style={globalStyles.card}>
        {/* email input with icon */}
        <View style={globalStyles.row}>
          <Ionicons 
            name="mail-outline" 
            size={24} 
            color="#007AFF" 
            style={globalStyles.icon}
          />
          <TextInput
            style={[globalStyles.input, { flex: 1, marginVertical: 0 }]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
          />
        </View>

        {/* contact info with icons */}
        <View style={{ marginTop: 20 }}>
          <View style={globalStyles.row}>
            <Ionicons name="call-outline" size={20} color="#4CAF50" />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              +1 234 567 890
            </Text>
          </View>
          
          <View style={globalStyles.row}>
            <Ionicons name="location-outline" size={20} color="#FF9800" />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              123 Education St, City
            </Text>
          </View>
        </View>
      </View>

      {/* submit button */}
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#28a745' }]}
        onPress={handleSubmit}
      >
        <Text style={globalStyles.buttonText}>📨 Submit</Text>
      </TouchableOpacity>

      {/* back button */}
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#6c757d' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContactScreen;