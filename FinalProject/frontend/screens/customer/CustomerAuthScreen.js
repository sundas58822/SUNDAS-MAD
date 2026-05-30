import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebaseConfig';
import { useTheme } from '../../constants/ThemeContext';
import { globalStyles } from '../../globalStyling';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
});
const signupSchema = Yup.object({
  name: Yup.string().min(2, 'Min 2 characters').required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
});

export default function CustomerAuthScreen({ navigation }) {
  const { theme, loginUser } = useTheme();
  const g = globalStyles(theme);
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }) => {
    setLoading(true); setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      const data = snap.exists() ? snap.data() : {};
      if (data.role && data.role !== 'customer') {
        setError('This account is not a customer account.'); return;
      }
      await loginUser({ id: cred.user.uid, email: cred.user.email, name: data.name || '', role: 'customer' });
    } catch (e) { setError('Invalid credentials. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSignup = async ({ name, email, password }) => {
    setLoading(true); setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), { name, email, role: 'customer', createdAt: new Date().toISOString() });
      await loginUser({ id: cred.user.uid, email, name, role: 'customer' });
    } catch (e) { setError('Signup failed. Email may already be in use.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[styles.header, { backgroundColor: '#FF6B35' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 55, left: 20 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 50 }}>🛍️</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 8 }}>Customer Portal</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{isLogin ? 'Welcome back!' : 'Create your account'}</Text>
        </View>

        <View style={[styles.form, { backgroundColor: theme.card }]}>
          <Text style={[g.subtitle, { marginBottom: 18 }]}>{isLogin ? 'Login' : 'Sign Up'}</Text>

          <Formik
            initialValues={isLogin ? { email: '', password: '' } : { name: '', email: '', password: '' }}
            validationSchema={isLogin ? loginSchema : signupSchema}
            onSubmit={isLogin ? handleLogin : handleSignup}
            enableReinitialize
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                {!isLogin && (
                  <>
                    <TextInput style={[g.input, { color: theme.text }]} placeholder="Full Name" placeholderTextColor={theme.subtext} value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} />
                    {touched.name && errors.name && <Text style={g.errorText}>{errors.name}</Text>}
                  </>
                )}
                <TextInput style={[g.input, { color: theme.text }]} placeholder="Email" placeholderTextColor={theme.subtext} keyboardType="email-address" autoCapitalize="none" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} />
                {touched.email && errors.email && <Text style={g.errorText}>{errors.email}</Text>}

                <View style={{ position: 'relative' }}>
                  <TextInput style={[g.input, { color: theme.text, paddingRight: 44 }]} placeholder="Password" placeholderTextColor={theme.subtext} secureTextEntry={!showPwd} value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(v => !v)}>
                    <Ionicons name={showPwd ? 'eye' : 'eye-off'} size={18} color={theme.subtext} />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && <Text style={g.errorText}>{errors.password}</Text>}

                {!!error && <Text style={[g.errorText, { marginBottom: 8, fontSize: 13 }]}>{error}</Text>}

                <TouchableOpacity style={[g.primaryButton, { opacity: loading ? 0.7 : 1 }]} onPress={handleSubmit} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={g.primaryButtonText}>{isLogin ? 'Login' : 'Create Account'}</Text>}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <TouchableOpacity onPress={() => { setIsLogin(v => !v); setError(''); }} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 80, paddingBottom: 36, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  form: { margin: 20, borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
});
