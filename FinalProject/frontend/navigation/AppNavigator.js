import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

import SplashScreen from '../screens/SplashScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import CustomerAuthScreen from '../screens/customer/CustomerAuthScreen';
import CustomerDashboard from '../screens/customer/CustomerDashboard';
import ProductListingScreen from '../screens/customer/ProductListingScreen';
import CartScreen from '../screens/customer/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import SellerAuthScreen from '../screens/seller/SellerAuthScreen';
import SellerDashboard from '../screens/seller/SellerDashboard';
import ManageProductsScreen from '../screens/seller/ManageProductsScreen';
import AdminAuthScreen from '../screens/admin/AdminAuthScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import SalesReportScreen from '../screens/admin/SalesReportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  const { theme, cart } = useTheme();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 60, paddingBottom: 6, paddingTop: 6 },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.subtext,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size, focused }) => {
        const map = { Home: focused ? 'home' : 'home-outline', Shop: focused ? 'paw' : 'paw-outline', Cart: focused ? 'cart' : 'cart-outline' };
        return <Ionicons name={map[route.name]} size={size} color={color} />;
      },
      tabBarBadge: route.name === 'Cart' && cartCount > 0 ? cartCount : undefined,
    })}>
      <Tab.Screen name="Home" component={CustomerDashboard} />
      <Tab.Screen name="Shop" component={ProductListingScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

function SellerTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 60, paddingBottom: 6, paddingTop: 6 },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: theme.subtext,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size, focused }) => {
        const map = { Dashboard: focused ? 'storefront' : 'storefront-outline', Products: focused ? 'cube' : 'cube-outline' };
        return <Ionicons name={map[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={SellerDashboard} />
      <Tab.Screen name="Products" component={ManageProductsScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 60, paddingBottom: 6, paddingTop: 6 },
      tabBarActiveTintColor: '#9C27B0',
      tabBarInactiveTintColor: theme.subtext,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size, focused }) => {
        const map = { Dashboard: focused ? 'shield' : 'shield-outline', Sales: focused ? 'bar-chart' : 'bar-chart-outline' };
        return <Ionicons name={map[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Sales" component={SalesReportScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold });

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B35' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !user ? (
          <>
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="CustomerAuth" component={CustomerAuthScreen} />
            <Stack.Screen name="SellerAuth" component={SellerAuthScreen} />
            <Stack.Screen name="AdminAuth" component={AdminAuthScreen} />
          </>
        ) : user.role === 'customer' ? (
          <>
            <Stack.Screen name="CustomerMain" component={CustomerTabs} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
          </>
        ) : user.role === 'seller' ? (
          <Stack.Screen name="SellerMain" component={SellerTabs} />
        ) : (
          <Stack.Screen name="AdminMain" component={AdminTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
