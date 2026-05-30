import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

export default function ProductListingScreen() {
  const { theme, addToCart } = useTheme();
  const g = globalStyles(theme);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (product) => {
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2000);
  };

  const renderItem = ({ item }) => (
    <View style={[g.card, { flexDirection: 'row', gap: 12 }]}>
      {item.imageUrl
        ? <Image source={{ uri: item.imageUrl }} style={styles.img} />
        : <View style={[styles.img, { backgroundColor: theme.inputBg, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 32 }}>🐾</Text>
          </View>
      }
      <View style={{ flex: 1 }}>
        <Text style={[g.subtitle, { fontSize: 15 }]} numberOfLines={1}>{item.name}</Text>
        <Text style={g.body} numberOfLines={2}>{item.description}</Text>
        <Text style={{ color: theme.subtext, fontSize: 12 }}>{item.category}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, alignItems: 'center' }}>
          <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 16 }}>${Number(item.price || 0).toFixed(2)}</Text>
          <Text style={{ fontSize: 11, fontWeight: '700', color: item.stock > 0 ? '#4CAF50' : '#FF3B30' }}>
            {item.stock > 0 ? `✓ ${item.stock} left` : '✗ Out of Stock'}
          </Text>
        </View>
        <TouchableOpacity
          style={[g.primaryButton, { paddingVertical: 8, marginTop: 8, opacity: item.stock === 0 ? 0.5 : 1 }]}
          onPress={() => handleAdd(item)}
          disabled={item.stock === 0}
        >
          <Text style={[g.primaryButtonText, { fontSize: 13 }]}>{item.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={g.screen}>
      <View style={[g.header, { backgroundColor: theme.primary }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>🛍️ Pet Shop</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 2, fontSize: 13 }}>{products.length} products available</Text>
      </View>

      {/* Search */}
      <View style={[styles.search, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.subtext} />
        <TextInput
          style={{ flex: 1, marginLeft: 8, color: theme.text }}
          placeholder="Search products..."
          placeholderTextColor={theme.subtext}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {loading
        ? <View style={g.center}><ActivityIndicator size="large" color={theme.primary} /></View>
        : filtered.length === 0
          ? <View style={g.center}>
              <Text style={{ fontSize: 50 }}>🐾</Text>
              <Text style={[g.body, { marginTop: 10 }]}>No products found</Text>
            </View>
          : <FlatList
              data={filtered}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
      }

      {/* Toast */}
      {!!toast && (
        <View style={styles.toast}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  img: { width: 88, height: 110, borderRadius: 14, resizeMode: 'cover' },
  toast: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#4CAF50', padding: 14, borderRadius: 14, alignItems: 'center' },
});
