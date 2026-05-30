import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

export default function AdminAuthScreen({ navigation }) {
  const { theme, loginUser } = useTheme();
  const g = globalStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      const data = snap.exists() ? snap.data() : {};
      if (data.role !== 'admin') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      await loginUser({ id: cred.user.uid, email: cred.user.email, name: data.name || 'Admin', role: 'admin' });
    } catch {
      setError('Invalid credentials or unauthorized access.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[styles.header, { backgroundColor: '#9C27B0' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 55, left: 20 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 50 }}>🛡️</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 8 }}>Admin Portal</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>Authorized personnel only</Text>
        </View>

        <View style={[styles.form, { backgroundColor: theme.card }]}>
          <View style={[styles.secBadge, { backgroundColor: '#9C27B015', borderColor: '#9C27B0' }]}>
            <Ionicons name="shield-checkmark" size={16} color="#9C27B0" />
            <Text style={{ color: '#9C27B0', fontWeight: '700', marginLeft: 6, fontSize: 13 }}>Secure Admin Login</Text>
          </View>

          <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 4, marginTop: 16, fontSize: 13 }}>Admin Email</Text>
          <TextInput
            style={[g.input, { color: theme.text }]}
            placeholder="admin@petparadise.com"
            placeholderTextColor={theme.subtext}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 4, fontSize: 13 }}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[g.input, { color: theme.text, paddingRight: 44 }]}
              placeholder="Password"
              placeholderTextColor={theme.subtext}
              secureTextEntry={!showPwd}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eye} onPress={() => setShowPwd(v => !v)}>
              <Ionicons name={showPwd ? 'eye' : 'eye-off'} size={18} color={theme.subtext} />
            </TouchableOpacity>
          </View>

          {!!error && <Text style={[g.errorText, { marginBottom: 10, fontSize: 13 }]}>{error}</Text>}

          <TouchableOpacity
            style={[g.primaryButton, { backgroundColor: '#9C27B0', opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={g.primaryButtonText}>Login as Admin</Text>}
          </TouchableOpacity>

          <View style={[styles.hintBox, { backgroundColor: theme.inputBg, marginTop: 16 }]}>
            <Text style={[g.body, { fontSize: 12 }]}>💡 Admin accounts must be pre-registered with role "admin" in Firebase.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 80, paddingBottom: 36, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  form: { margin: 20, borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  secBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  eye: { position: 'absolute', right: 12, top: 12 },
  hintBox: { borderRadius: 12, padding: 12 },
});
