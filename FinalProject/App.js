import React from 'react';
import { ThemeProvider } from './frontend/constants/ThemeContext';
import AppNavigator from './frontend/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
