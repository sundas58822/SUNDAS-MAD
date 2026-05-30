// frontend/screens/LoginScreen.js

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

const C = theme.colors;
const F = theme.fonts;
const S = theme.spacing;
const R = theme.radius;

const friendlyError = (code) => {
  const map = {
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/email-already-in-use':   'This email is already registered. Try logging in.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};

export default function LoginScreen() {
  const { login, register } = useAuth();

  const [mode,         setMode]         = useState('login');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required.');    shakeForm(); return; }
    if (!password)     { setError('Password is required.'); shakeForm(); return; }
    setError('');
    setIsLoading(true);
    try {
      mode === 'register'
        ? await register(email.trim(), password)
        : await login(email.trim(), password);
    } catch (err) {
      setError(friendlyError(err.code));
      shakeForm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand Header ─────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoIcon}>📝</Text>
          </View>
          <Text style={styles.brandName}>NoteVault</Text>
          <Text style={styles.brandSub}>Your private space for thoughts</Text>
        </View>

        {/* ── Tab Toggle ───────────────────────────── */}
        <View style={styles.tabRow}>
          {['login', 'register'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, mode === tab && styles.tabActive]}
              onPress={() => switchMode(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, mode === tab && styles.tabTextActive]}>
                {tab === 'login' ? 'Sign In' : 'Register'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Form ─────────────────────────────────── */}
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputWrap, focusedInput === 'email' && styles.inputWrapFocus]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={[styles.inputWrap, focusedInput === 'password' && styles.inputWrapFocus]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠  {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In  →' : 'Create Account  →'}
                </Text>
            }
          </TouchableOpacity>

        </Animated.View>

        {/* ── Footer ───────────────────────────────── */}
        <Text style={styles.footer}>
          {mode === 'login' ? "New here?  " : "Have an account?  "}
          <Text
            style={styles.footerLink}
            onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: C.background },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: S.lg, paddingVertical: S.xxl },

  header:   { alignItems: 'center', marginBottom: S.xl },
  logoWrap: {
    width: 80, height: 80, borderRadius: R.xl,
    backgroundColor: C.primaryGlow,
    borderWidth: 1.5, borderColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: S.md,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  logoIcon:  { fontSize: 36 },
  brandName: { fontSize: F.xxxl, fontWeight: F.extraBold, color: C.textPrimary, letterSpacing: -0.5 },
  brandSub:  { fontSize: F.sm, color: C.textSecondary, marginTop: S.xs },

  tabRow: {
    flexDirection: 'row', backgroundColor: C.surface,
    borderRadius: R.md, padding: 4, marginBottom: S.lg,
    borderWidth: 1, borderColor: C.border,
  },
  tab:           { flex: 1, paddingVertical: S.sm + 2, borderRadius: R.sm, alignItems: 'center' },
  tabActive:     { backgroundColor: C.primary },
  tabText:       { fontSize: F.md, fontWeight: F.semiBold, color: C.textMuted },
  tabTextActive: { color: '#FFF' },

  form:      { gap: S.md },
  fieldWrap: { gap: S.xs },
  fieldLabel: { fontSize: F.xs, fontWeight: F.bold, color: C.textSecondary, letterSpacing: 1.2 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: R.md, paddingHorizontal: S.md,
  },
  inputWrapFocus: { borderColor: C.borderFocus },
  inputIcon:      { fontSize: 16, marginRight: S.sm, color: C.textMuted },
  input: {
    flex: 1, paddingVertical: S.md - 2,
    fontSize: F.md, color: C.textPrimary,
  },

  errorBox:  {
    backgroundColor: C.dangerGlow, borderWidth: 1,
    borderColor: C.danger, borderRadius: R.sm, padding: S.md,
  },
  errorText: { color: C.danger, fontSize: F.sm, fontWeight: F.medium },

  submitBtn: {
    backgroundColor: C.primary, borderRadius: R.md,
    paddingVertical: S.md + 2, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 16, elevation: 10, marginTop: S.xs,
  },
  submitBtnDisabled: { opacity: 0.55 },
  submitBtnText:     { color: '#FFF', fontSize: F.lg, fontWeight: F.bold, letterSpacing: 0.3 },

  footer:     { textAlign: 'center', color: C.textSecondary, fontSize: F.sm, marginTop: S.xl },
  footerLink: { color: C.primary, fontWeight: F.semiBold },
});