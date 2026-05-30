import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

const STATUS_OPTIONS = ['All', 'pending', 'processing', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: '#FF9800', processing: '#03A9F4', delivered: '#4CAF50', cancelled: '#FF3B30' };

export default function SalesReportScreen() {
  const { theme } = useTheme();
  const g = globalStyles(theme);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const avgOrder = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  // Group by date for chart simulation
  const byDate = {};
  filtered.forEach(o => {
    const d = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown';
    byDate[d] = (byDate[d] || 0) + (o.totalAmount || 0);
  });
  const dateEntries = Object.entries(byDate).slice(0, 7);
  const maxVal = Math.max(...dateEntries.map(([, v]) => v), 1);

  return (
    <View style={g.screen}>
      <View style={[g.header, { backgroundColor: '#9C27B0' }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>📊 Sales Report</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 2, fontSize: 13 }}>Platform-wide analytics</Text>
      </View>

      {loading
        ? <View style={g.center}><ActivityIndicator size="large" color="#9C27B0" /></View>
        : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <View style={[styles.sumCard, { backgroundColor: '#9C27B015', borderColor: '#9C27B0', flex: 1 }]}>
                <Text style={{ fontSize: 20 }}>💰</Text>
                <Text style={{ fontWeight: '800', color: '#9C27B0', fontSize: 18 }}>${totalRevenue.toFixed(2)}</Text>
                <Text style={[g.body, { fontSize: 11 }]}>Total Revenue</Text>
              </View>
              <View style={[styles.sumCard, { backgroundColor: '#03A9F415', borderColor: '#03A9F4', flex: 1 }]}>
                <Text style={{ fontSize: 20 }}>🛒</Text>
                <Text style={{ fontWeight: '800', color: '#03A9F4', fontSize: 18 }}>{filtered.length}</Text>
                <Text style={[g.body, { fontSize: 11 }]}>Orders</Text>
              </View>
              <View style={[styles.sumCard, { backgroundColor: '#FF6B3515', borderColor: '#FF6B35', flex: 1 }]}>
                <Text style={{ fontSize: 20 }}>📈</Text>
                <Text style={{ fontWeight: '800', color: '#FF6B35', fontSize: 18 }}>${avgOrder.toFixed(0)}</Text>
                <Text style={[g.body, { fontSize: 11 }]}>Avg. Order</Text>
              </View>
            </View>

            {/* Status breakdown */}
            <View style={g.card}>
              <Text style={[g.subtitle, { marginBottom: 12, fontSize: 16 }]}>Status Breakdown</Text>
              {['pending', 'processing', 'delivered', 'cancelled'].map(s => {
                const count = orders.filter(o => o.status === s).length;
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <View key={s} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: STATUS_COLORS[s], fontWeight: '700', textTransform: 'capitalize', fontSize: 13 }}>{s}</Text>
                      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{count} ({pct.toFixed(0)}%)</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: theme.border, borderRadius: 4 }}>
                      <View style={{ height: 8, backgroundColor: STATUS_COLORS[s], borderRadius: 4, width: `${pct}%` }} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Revenue by date (bar chart) */}
            {dateEntries.length > 0 && (
              <View style={g.card}>
                <Text style={[g.subtitle, { marginBottom: 12, fontSize: 16 }]}>Revenue by Date</Text>
                {dateEntries.map(([date, val]) => (
                  <View key={date} style={{ marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                      <Text style={[g.body, { fontSize: 11 }]}>{date}</Text>
                      <Text style={{ color: '#9C27B0', fontWeight: '700', fontSize: 11 }}>${val.toFixed(2)}</Text>
                    </View>
                    <View style={{ height: 10, backgroundColor: theme.border, borderRadius: 5 }}>
                      <View style={{ height: 10, backgroundColor: '#9C27B0', borderRadius: 5, width: `${(val / maxVal) * 100}%` }} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Filter tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {STATUS_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.tab, { backgroundColor: filter === s ? '#9C27B0' : theme.inputBg, borderColor: filter === s ? '#9C27B0' : theme.border }]}
                  onPress={() => setFilter(s)}
                >
                  <Text style={{ color: filter === s ? '#fff' : theme.text, fontWeight: '700', fontSize: 12, textTransform: 'capitalize' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Orders list */}
            {filtered.length === 0
              ? <View style={[g.card, { alignItems: 'center', padding: 24 }]}>
                  <Text style={{ fontSize: 40 }}>📭</Text>
                  <Text style={[g.body, { marginTop: 8 }]}>No orders found</Text>
                </View>
              : filtered.map(order => (
                <View key={order.id} style={g.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>🧾 {order.invoiceId || order.id.slice(0, 10)}</Text>
                      <Text style={[g.body, { marginTop: 2 }]}>{order.customer?.name || 'Unknown'}</Text>
                      <Text style={[g.body, { fontSize: 12, marginTop: 1 }]}>{order.items?.length || 0} items • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: '#9C27B0', fontWeight: '800', fontSize: 15 }}>${Number(order.totalAmount || 0).toFixed(2)}</Text>
                      <View style={[styles.badge, { backgroundColor: (STATUS_COLORS[order.status] || '#888') + '22', marginTop: 4 }]}>
                        <Text style={{ color: STATUS_COLORS[order.status] || '#888', fontSize: 10, fontWeight: '700', textTransform: 'capitalize' }}>{order.status || 'pending'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            }
          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  sumCard: { borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1 },
  tab: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
});
