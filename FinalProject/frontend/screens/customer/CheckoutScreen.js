import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

const schema = Yup.object({
  fullName: Yup.string().min(3, 'Min 3 characters').required('Full name is required'),
  address: Yup.string().min(10, 'Please enter full address').required('Address is required'),
  phone: Yup.string().min(7, 'Invalid phone').required('Phone is required'),
});

function genInvoice() { return 'INV-' + Date.now().toString(36).toUpperCase(); }

export default function CheckoutScreen({ navigation }) {
  const { theme, user, cart, clearCart } = useTheme();
  const g = globalStyles(theme);
  const [successModal, setSuccessModal] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;

  const placeOrder = async (values, { setSubmitting }) => {
    try {
      const invoiceId = genInvoice();
      const order = {
        invoiceId,
        customer: { name: values.fullName, address: values.address, phone: values.phone, email: user?.email, userId: user?.id },
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity })),
        subtotal,
        shipping,
        totalAmount: subtotal + shipping,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'orders'), order);
      setInvoice(order);
      clearCart();
      setSuccessModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={g.screen}>
      <View style={[g.header, { backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={g.card}>
          <Text style={[g.subtitle, { marginBottom: 8 }]}>Order Summary</Text>
          {cart.map(i => (
            <View key={i.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
              <Text style={[g.body, { flex: 1 }]} numberOfLines={1}>{i.name} × {i.quantity}</Text>
              <Text style={{ color: theme.text, fontWeight: '700' }}>${(i.price * i.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={{ borderTopWidth: 1, borderColor: theme.border, marginTop: 8, paddingTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={g.subtitle}>Total</Text>
              <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 18 }}>${(subtotal + shipping).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Shipping Form */}
        <View style={g.card}>
          <Text style={[g.subtitle, { marginBottom: 14 }]}>Shipping Details</Text>
          <Formik initialValues={{ fullName: user?.name || '', address: '', phone: '' }} validationSchema={schema} onSubmit={placeOrder}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                {[
                  { f: 'fullName', label: 'Full Name', icon: 'person-outline', kb: 'default' },
                  { f: 'address', label: 'Delivery Address', icon: 'location-outline', kb: 'default' },
                  { f: 'phone', label: 'Phone Number', icon: 'call-outline', kb: 'phone-pad' },
                ].map(({ f, label, icon, kb }) => (
                  <View key={f}>
                    <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 4, fontSize: 14 }}>{label}</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                      <Ionicons name={icon} size={16} color={theme.subtext} />
                      <TextInput
                        style={{ flex: 1, marginLeft: 8, color: theme.text }}
                        placeholder={label}
                        placeholderTextColor={theme.subtext}
                        keyboardType={kb}
                        value={values[f]}
                        onChangeText={handleChange(f)}
                        onBlur={handleBlur(f)}
                      />
                    </View>
                    {touched[f] && errors[f] && <Text style={g.errorText}>{errors[f]}</Text>}
                  </View>
                ))}
                <TouchableOpacity style={[g.primaryButton, { marginTop: 10, opacity: isSubmitting ? 0.7 : 1 }]} onPress={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={g.primaryButtonText}>Place Order 🎉</Text>}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: 60, textAlign: 'center' }}>🎉</Text>
            <Text style={[g.title, { textAlign: 'center', marginTop: 8 }]}>Order Placed!</Text>
            <Text style={[g.body, { textAlign: 'center', marginTop: 4 }]}>Your order is being processed</Text>
            {invoice && (
              <View style={[styles.invoiceBox, { backgroundColor: theme.bg }]}>
                <Text style={{ fontWeight: '700', color: theme.text }}>🧾 {invoice.invoiceId}</Text>
                <Text style={g.body}>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
                <Text style={g.body}>Items: {invoice.items?.length}</Text>
                <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 18, marginTop: 4 }}>Total: ${invoice.totalAmount?.toFixed(2)}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[g.primaryButton, { width: '100%', marginTop: 10 }]}
              onPress={() => { setSuccessModal(false); navigation.navigate('Home'); }}
            >
              <Text style={g.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 6 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modal: { borderRadius: 28, padding: 28, width: '100%', alignItems: 'center' },
  invoiceBox: { borderRadius: 14, padding: 14, marginVertical: 12, width: '100%' },
});
