import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal,
  TextInput, Alert, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

const CATEGORIES = ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Pets', 'Reptiles', 'Other'];

const emptyForm = { name: '', description: '', price: '', stock: '', category: 'Dogs', imageUrl: '' };

export default function ManageProductsScreen() {
  const { theme, user } = useTheme();
  const g = globalStyles(theme);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const unsub = onSnapshot(
      query(collection(db, 'products'), where('sellerId', '==', user.id)),
      snap => { setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, [user?.id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setErrors({}); setModalVisible(true); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock), category: p.category || 'Dogs', imageUrl: p.imageUrl || '' }); setEditingId(p.id); setErrors({}); setModalVisible(true); };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = { name: form.name.trim(), description: form.description.trim(), price: parseFloat(form.price), stock: parseInt(form.stock), category: form.category, imageUrl: form.imageUrl.trim(), sellerId: user.id, updatedAt: new Date().toISOString() };
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data);
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: new Date().toISOString() });
      }
      setModalVisible(false);
    } catch (e) { Alert.alert('Error', 'Failed to save product. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id, name) => {
    Alert.alert('Delete Product', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteDoc(doc(db, 'products', id)); }
        catch { Alert.alert('Error', 'Failed to delete product.'); }
      }},
    ]);
  };

  const Field = ({ label, field, kb, multiline }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>{label}</Text>
      <TextInput
        style={[g.input, { color: theme.text, marginBottom: 0, height: multiline ? 72 : undefined, textAlignVertical: multiline ? 'top' : undefined }]}
        placeholder={label}
        placeholderTextColor={theme.subtext}
        keyboardType={kb || 'default'}
        multiline={multiline}
        value={form[field]}
        onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
      />
      {errors[field] && <Text style={g.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View style={g.screen}>
      <View style={[g.header, { backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>📦 My Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {loading
        ? <View style={g.center}><ActivityIndicator size="large" color="#4CAF50" /></View>
        : products.length === 0
          ? <View style={g.center}>
              <Text style={{ fontSize: 50 }}>📦</Text>
              <Text style={[g.subtitle, { marginTop: 12 }]}>No products yet</Text>
              <Text style={[g.body, { marginTop: 4 }]}>Tap + to add your first product</Text>
              <TouchableOpacity style={[g.primaryButton, { backgroundColor: '#4CAF50', marginTop: 16 }]} onPress={openAdd}>
                <Text style={g.primaryButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          : <FlatList
              data={products}
              keyExtractor={i => i.id}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={[g.card, { flexDirection: 'row', gap: 12 }]}>
                  {item.imageUrl
                    ? <Image source={{ uri: item.imageUrl }} style={styles.img} />
                    : <View style={[styles.img, { backgroundColor: theme.inputBg, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 28 }}>🐾</Text>
                      </View>
                  }
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 15 }} numberOfLines={1}>{item.name}</Text>
                    <Text style={g.body} numberOfLines={1}>{item.category}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' }}>
                      <Text style={{ color: '#4CAF50', fontWeight: '800', fontSize: 15 }}>${Number(item.price || 0).toFixed(2)}</Text>
                      <Text style={{ color: item.stock > 0 ? '#4CAF50' : '#FF3B30', fontSize: 12, fontWeight: '700' }}>
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ gap: 8, justifyContent: 'center' }}>
                    <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: '#03A9F420' }]} onPress={() => openEdit(item)}>
                      <Ionicons name="pencil" size={16} color="#03A9F4" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: '#FF3B3020' }]} onPress={() => handleDelete(item.id, item.name)}>
                      <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
      }

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={g.subtitle}>{editingId ? 'Edit Product' : 'Add Product'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Field label="Product Name *" field="name" />
              <Field label="Description" field="description" multiline />
              <Field label="Price ($) *" field="price" kb="decimal-pad" />
              <Field label="Stock Quantity *" field="stock" kb="number-pad" />
              <Field label="Image URL (optional)" field="imageUrl" kb="url" />

              <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, { backgroundColor: form.category === cat ? '#4CAF50' : theme.inputBg, borderColor: form.category === cat ? '#4CAF50' : theme.border }]}
                    onPress={() => setForm(f => ({ ...f, category: cat }))}
                  >
                    <Text style={{ color: form.category === cat ? '#fff' : theme.text, fontSize: 12, fontWeight: '700' }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[g.primaryButton, { backgroundColor: '#4CAF50', opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={g.primaryButtonText}>{editingId ? 'Update Product' : 'Add Product'}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: { backgroundColor: '#fff', width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  img: { width: 72, height: 80, borderRadius: 12, resizeMode: 'cover' },
  iconActionBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  catChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
});
