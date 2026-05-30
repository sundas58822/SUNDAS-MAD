import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [storedTheme, storedUser] = await Promise.all([
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('user'),
        ]);
        if (storedTheme) setIsDark(storedTheme === 'dark');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const loginUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = async () => {
    setUser(null);
    setCart([]);
    await AsyncStorage.removeItem('user');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';
  const isCustomer = user?.role === 'customer';

  const theme = {
    bg: isDark ? '#1a1a2e' : '#FFF8F0',
    card: isDark ? '#16213e' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2D2D2D',
    subtext: isDark ? '#AAAAAA' : '#777777',
    primary: '#FF6B35',
    secondary: '#4CAF50',
    accent: '#03A9F4',
    border: isDark ? '#333355' : '#EAEAEA',
    inputBg: isDark ? '#0f3460' : '#F5F5F5',
  };

  return (
    <ThemeContext.Provider value={{
      isDark, toggleTheme, theme,
      user, loginUser, logoutUser,
      isAdmin, isSeller, isCustomer,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
