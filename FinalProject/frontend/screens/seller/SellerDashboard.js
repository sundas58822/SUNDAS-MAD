import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';

export default function SellerDashboard() {
  const { theme, user, logoutUser } = useTheme();
  const g = globalStyles(theme);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    // Listen to seller's products
    const prodUnsub = onSnapshot(
      query(collection(db, 'products'), where('sellerId', '==', user.id)),
      snap => setStats(prev => ({ ...prev, products: snap.size }))
    );

    // Listen to orders (all orders that contain this seller's products)
    const ordUnsub = onSnapshot(collection(db, 'orders'), snap => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filter orders containing this seller's products
      const sellerOrders = orders.filter(o =>
        o.items?.some(item => item.sellerId === user.id)
      );
      // If no sellerId on items, show all orders (for demo)
      const displayOrders = sellerOrders.length > 0 ? sellerOrders : orders;
      const revenue = displayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      setStats(prev => ({ ...prev, orders: displayOrders.length, revenue }));
      setRecentOrders(displayOrders.slice(0, 5));
      setLoading(false);
    });

    return () => { prodUnsub(); ordUnsub(); };
  }, [user?.id]);

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

  const statusColor = { pending: '#FF9800', processing: '#03A9F4', delivered: '#4CAF50', cancelled: '#FF3B30' };

  return (
    <>
      <ScrollView style={g.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#4CAF50' }]}>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>🏪 Store Dashboard</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>{user?.name || 'My Store'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading
        ? <View style={[g.center, { marginTop: 40 }]}><ActivityIndicator size="large" color="#4CAF50" /></View>
        : (
          <>
            {/* Stats */}
            <View style={{ flexDirection: 'row', padding: 16, gap: 10 }}>
              {[
                { label: 'Products', value: stats.products, emoji: '📦', color: '#4CAF50' },
                { label: 'Orders', value: stats.orders, emoji: '🛒', color: '#03A9F4' },
                { label: 'Revenue', value: `$${stats.revenue.toFixed(0)}`, emoji: '💰', color: '#FF6B35' },
              ].map(s => (
                <View key={s.label} style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
                  <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: s.color }}>{s.value}</Text>
                  <Text style={[g.body, { fontSize: 11, textAlign: 'center' }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Recent Orders */}
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={[g.subtitle, { marginBottom: 12 }]}>Recent Orders</Text>
              {recentOrders.length === 0
                ? <View style={[g.card, { alignItems: 'center', padding: 24 }]}>
                    <Text style={{ fontSize: 40 }}>📋</Text>
                    <Text style={[g.body, { marginTop: 8 }]}>No orders yet</Text>
                  </View>
                : recentOrders.map(order => (
                  <View key={order.id} style={g.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>🧾 {order.invoiceId || order.id.slice(0, 8)}</Text>
                        <Text style={[g.body, { marginTop: 2 }]}>{order.customer?.name || 'Customer'}</Text>
                        <Text style={[g.body, { fontSize: 12, marginTop: 1 }]}>{order.items?.length || 0} items</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#4CAF50', fontWeight: '800', fontSize: 15 }}>${Number(order.totalAmount || 0).toFixed(2)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: (statusColor[order.status] || '#888') + '20' }]}>
                          <Text style={{ color: statusColor[order.status] || '#888', fontSize: 11, fontWeight: '700' }}>
                            {order.status || 'pending'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>

            {/* Tips */}
            <View style={[styles.tipBox, { backgroundColor: '#4CAF5015', borderColor: '#4CAF50', margin: 16 }]}>
              <Text style={{ color: '#4CAF50', fontWeight: '700', marginBottom: 6 }}>💡 Quick Tips</Text>
              <Text style={[g.body, { fontSize: 13 }]}>• Add products in the Products tab</Text>
              <Text style={[g.body, { fontSize: 13 }]}>• Keep stock updated for better sales</Text>
              <Text style={[g.body, { fontSize: 13 }]}>• Customers with $50+ get free shipping</Text>
            </View>
          </>
        )
      }
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
  statCard: { borderRadius: 16, padding: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  tipBox: { borderRadius: 16, padding: 16, borderWidth: 1 },
});
