import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

export default function CartScreen({ navigation }) {
  const { theme, cart, removeFromCart, updateQuantity } = useTheme();
  const g = globalStyles(theme);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <View style={[g.screen, g.center]}>
        <Text style={{ fontSize: 80 }}>🛒</Text>
        <Text style={[g.subtitle, { marginTop: 12 }]}>Your cart is empty!</Text>
        <Text style={[g.body, { marginTop: 4 }]}>Add some products to continue</Text>
      </View>
    );
  }

  return (
    <View style={g.screen}>
      <View style={[g.header, { backgroundColor: theme.primary }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>My Cart 🛒</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[g.card, { flexDirection: 'row', gap: 12 }]}>
            {item.imageUrl
              ? <Image source={{ uri: item.imageUrl }} style={styles.img} />
              : <View style={[styles.img, { backgroundColor: theme.inputBg, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 26 }}>🐾</Text>
                </View>
            }
            <View style={{ flex: 1 }}>
              <Text style={[g.subtitle, { fontSize: 14 }]} numberOfLines={1}>{item.name}</Text>
              <Text style={{ color: theme.primary, fontWeight: '800', marginTop: 2 }}>${Number(item.price || 0).toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 8, alignItems: 'center' }}>
                <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: theme.border }]} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Ionicons name="remove" size={16} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ fontWeight: '700', fontSize: 16, color: theme.text, minWidth: 24, textAlign: 'center' }}>{item.quantity}</Text>
                <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: theme.border }]} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Ionicons name="add" size={16} color={theme.text} />
                </TouchableOpacity>
                <Text style={[g.body, { marginLeft: 4 }]}>= ${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={{ padding: 4 }}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={(
          <View style={g.card}>
            <Text style={[g.subtitle, { marginBottom: 10 }]}>Order Summary</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={g.body}>Subtotal</Text>
              <Text style={{ color: theme.text, fontWeight: '700' }}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={g.body}>Shipping</Text>
              <Text style={{ color: shipping === 0 ? '#4CAF50' : theme.text, fontWeight: '700' }}>
                {shipping === 0 ? 'FREE 🎉' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={{ borderTopWidth: 1, borderColor: theme.border, paddingTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={g.subtitle}>Total</Text>
                <Text style={{ color: theme.primary, fontSize: 22, fontWeight: '800' }}>${total.toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity style={[g.primaryButton, { marginTop: 14 }]} onPress={() => navigation.navigate('Checkout')}>
              <Text style={g.primaryButtonText}>Proceed to Checkout 🚀</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  img: { width: 72, height: 72, borderRadius: 12, resizeMode: 'cover' },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
