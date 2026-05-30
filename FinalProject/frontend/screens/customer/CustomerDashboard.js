import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';

const CATEGORIES = [
  { name: 'Dogs', emoji: '🐶', color: '#FFE0CC' },
  { name: 'Cats', emoji: '🐱', color: '#E8F5E9' },
  { name: 'Birds', emoji: '🐦', color: '#E3F2FD' },
  { name: 'Sale', emoji: '🏷️', color: '#FCE4EC' },
];

export default function CustomerDashboard({ navigation }) {
  const { theme, user, logoutUser, cart, isDark, toggleTheme } = useTheme();
  const g = globalStyles(theme);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
      if (typeof window !== 'undefined') {
        window.alert('Failed to logout. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    }
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <ScrollView style={g.screen} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>👋 Welcome back</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>{user?.name || 'Pet Lover'}!</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
          <View style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
            <Text style={{ fontSize: 28 }}>🛒</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: theme.primary }}>{totalItems}</Text>
            <Text style={g.body}>Cart Items</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
            <Text style={{ fontSize: 28 }}>🛍️</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#4CAF50' }}>{cart.length}</Text>
            <Text style={g.body}>Products</Text>
          </View>
        </View>

        {/* Promo */}
        <View style={[styles.promo, { backgroundColor: '#4CAF50' }]}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>🚚 Free Shipping on orders over $50!</Text>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[g.subtitle, { marginBottom: 12 }]}>Shop by Category</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.catCard, { backgroundColor: cat.color }]}
                onPress={() => navigation.navigate('Shop')}
              >
                <Text style={{ fontSize: 34 }}>{cat.emoji}</Text>
                <Text style={{ fontWeight: '700', marginTop: 6, color: '#333' }}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={[g.primaryButton, { flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
            onPress={() => navigation.navigate('Shop')}
          >
            <Ionicons name="paw" size={18} color="#fff" />
            <Text style={g.primaryButtonText}>Browse All Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LogoutConfirmModal
        visible={logoutModalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.25)', padding: 8, borderRadius: 12 },
  statCard: { borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  promo: { margin: 16, borderRadius: 16, padding: 14, alignItems: 'center' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catCard: { width: '47%', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 4 },
});
