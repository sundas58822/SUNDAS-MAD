import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';

export default function AdminDashboard() {
  const { theme, user, logoutUser } = useTheme();
  const g = globalStyles(theme);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0, customers: 0, sellers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    let done = 0;
    const check = () => { done++; if (done >= 3) setLoading(false); };

    const usersUnsub = onSnapshot(collection(db, 'users'), snap => {
      const users = snap.docs.map(d => d.data());
      setStats(prev => ({
        ...prev,
        users: snap.size,
        customers: users.filter(u => u.role === 'customer').length,
        sellers: users.filter(u => u.role === 'seller').length,
      }));
      check();
    }, check);

    const productsUnsub = onSnapshot(collection(db, 'products'), snap => {
      setStats(prev => ({ ...prev, products: snap.size }));
      check();
    }, check);

    const ordersUnsub = onSnapshot(collection(db, 'orders'), snap => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      setStats(prev => ({ ...prev, orders: orders.length, revenue }));
      setRecentOrders(orders.slice(0, 6));
      check();
    }, check);

    return () => { usersUnsub(); productsUnsub(); ordersUnsub(); };
  }, []);

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
      <View style={[styles.header, { backgroundColor: '#9C27B0' }]}>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>🛡️ Admin Panel</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>{user?.name || 'Administrator'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading
        ? <View style={[g.center, { marginTop: 40 }]}><ActivityIndicator size="large" color="#9C27B0" /></View>
        : (
          <>
            {/* Platform Stats Grid */}
            <View style={{ padding: 16 }}>
              <Text style={[g.subtitle, { marginBottom: 12 }]}>Platform Overview</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <View style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
                  <Text style={{ fontSize: 24 }}>👥</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#9C27B0' }}>{stats.users}</Text>
                  <Text style={[g.body, { fontSize: 11 }]}>Total Users</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
                  <Text style={{ fontSize: 24 }}>📦</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#03A9F4' }}>{stats.products}</Text>
                  <Text style={[g.body, { fontSize: 11 }]}>Products</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card, flex: 1 }]}>
                  <Text style={{ fontSize: 24 }}>🛒</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FF6B35' }}>{stats.orders}</Text>
                  <Text style={[g.body, { fontSize: 11 }]}>Orders</Text>
                </View>
              </View>
              <View style={[g.card, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>🛍️</Text>
                  <Text style={{ fontWeight: '800', color: '#FF6B35', fontSize: 18 }}>{stats.customers}</Text>
                  <Text style={g.body}>Customers</Text>
                </View>
                <View style={{ width: 1, backgroundColor: theme.border }} />
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>🏪</Text>
                  <Text style={{ fontWeight: '800', color: '#4CAF50', fontSize: 18 }}>{stats.sellers}</Text>
                  <Text style={g.body}>Sellers</Text>
                </View>
                <View style={{ width: 1, backgroundColor: theme.border }} />
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>💰</Text>
                  <Text style={{ fontWeight: '800', color: '#9C27B0', fontSize: 18 }}>${stats.revenue.toFixed(0)}</Text>
                  <Text style={g.body}>Revenue</Text>
                </View>
              </View>
            </View>

            {/* Recent Orders */}
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <Text style={[g.subtitle, { marginBottom: 12 }]}>Recent Orders</Text>
              {recentOrders.length === 0
                ? <View style={[g.card, { alignItems: 'center', padding: 24 }]}>
                    <Text style={{ fontSize: 40 }}>📋</Text>
                    <Text style={[g.body, { marginTop: 8 }]}>No orders yet</Text>
                  </View>
                : recentOrders.map(order => (
                  <View key={order.id} style={g.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>🧾 {order.invoiceId || order.id.slice(0, 10)}</Text>
                        <Text style={[g.body, { marginTop: 2 }]}>{order.customer?.name || 'Unknown Customer'}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#9C27B0', fontWeight: '800' }}>${Number(order.totalAmount || 0).toFixed(2)}</Text>
                        <View style={[styles.badge, { backgroundColor: (statusColor[order.status] || '#888') + '22' }]}>
                          <Text style={{ color: statusColor[order.status] || '#888', fontSize: 10, fontWeight: '700' }}>{order.status || 'pending'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              }
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
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
});
