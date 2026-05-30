import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import * as Font from 'expo-font';  // font import
import globalStyles from '../../style';

const HomeScreen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);  // font load status

  // font load karne ka function
  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        });
        setFontLoaded(true);  // font load ho gaya
        console.log('Font loaded successfully!');
      } catch (error) {
        console.log('Font loading error:', error);
        setFontLoaded(true);  // error aane par bhi true kar do (default font use hoga)
      }
    }
    loadFont();
  }, []);

  return (
   // ✅ YEH WORKING URL HAI
<ImageBackground
 source={require('../../assets/images/img.jpg')} 
  style={[globalStyles.container, { padding: 0 }]}
  resizeMode="cover"
>

      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        justifyContent: 'center',
      }}>
        <Text style={[
          globalStyles.title,
          { 
            color: 'white',
            // agar font loaded hai to Poppins-Bold use karo, nahi to normal bold
            fontFamily: fontLoaded ? 'Poppins-Bold' : 'sans-serif',
            fontSize: 36,
            marginBottom: 50,
            fontWeight: fontLoaded ? 'normal' : 'bold',  // fallback
          }
        ]}>
          🎓 Student App
        </Text>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={globalStyles.buttonText}>Go to Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: '#FF9800' }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={globalStyles.buttonText}>App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: '#f44336' }]}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={globalStyles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;