// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './frontend/context/AuthContext';
import AppNavigator from './frontend/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}