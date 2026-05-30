import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './frontend/navigation/AppNavigator';  // navigation import

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </>
  );
}