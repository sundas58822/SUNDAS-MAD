import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import globalStyles from '../../style';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);  // dark mode state

  // conditional styling
  const containerStyle = [
    globalStyles.container,
    isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer
  ];

  const textStyle = [
    globalStyles.title,
    isDarkMode ? globalStyles.darkTitle : globalStyles.lightTitle
  ];

  return (
    <SafeAreaView style={containerStyle}>
      <Text style={textStyle}>⚙️ Settings</Text>

      <View style={[
        globalStyles.card,
        { backgroundColor: isDarkMode ? '#444' : 'white' }
      ]}>
        {/* dark mode toggle */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: 10
        }}>
          <Text style={{ 
            fontSize: 18,
            color: isDarkMode ? 'white' : 'black'
          }}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* preview */}
        <View style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
          borderRadius: 10,
          alignItems: 'center'
        }}>
          <Text style={{ 
            color: isDarkMode ? 'white' : 'black',
            fontSize: 16 
          }}>
            {isDarkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
          </Text>
        </View>
      </View>

      {/* back button */}
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;