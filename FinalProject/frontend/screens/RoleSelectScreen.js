import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { globalStyles } from '../globalStyling';

const roles = [
  { label: 'Customer', emoji: '🛍️', route: 'CustomerAuth', color: '#FF6B35', desc: 'Browse & buy pet products' },
  { label: 'Seller', emoji: '🏪', route: 'SellerAuth', color: '#4CAF50', desc: 'Manage your pet store' },
  { label: 'Admin', emoji: '🛡️', route: 'AdminAuth', color: '#9C27B0', desc: 'Platform administration' },
];

export default function RoleSelectScreen({ navigation }) {
  const { theme } = useTheme();
  const g = globalStyles(theme);

  return (
    <View style={[g.screen, g.center, { paddingHorizontal: 24 }]}>
      <Text style={{ fontSize: 60, marginBottom: 8 }}>🐾</Text>
      <Text style={[g.title, { textAlign: 'center', marginBottom: 6 }]}>PetParadise</Text>
      <Text style={[g.body, { textAlign: 'center', marginBottom: 36 }]}>Choose how you'd like to continue</Text>

      {roles.map(r => (
        <TouchableOpacity
          key={r.label}
          style={[styles.card, { backgroundColor: r.color + '18', borderColor: r.color, borderWidth: 1.5 }]}
          onPress={() => navigation.navigate(r.route)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 36 }}>{r.emoji}</Text>
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontWeight: '800', fontSize: 18, color: r.color }}>{r.label}</Text>
            <Text style={[g.body, { marginTop: 2 }]}>{r.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 20, padding: 20, marginBottom: 14 },
});
