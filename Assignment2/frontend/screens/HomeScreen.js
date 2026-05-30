// frontend/screens/HomeScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView,
  Platform, Animated,
} from 'react-native';
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import ConfirmModal from '../components/ConfirmModal';

const C = theme.colors;
const F = theme.fonts;
const S = theme.spacing;
const R = theme.radius;

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const [noteText,     setNoteText]     = useState('');
  const [notes,        setNotes]        = useState([]);
  const [isSaving,     setIsSaving]     = useState(false);
  const [isLoading,    setIsLoading]    = useState(true);
  const [saveStatus,   setSaveStatus]   = useState('');
  const [focusedInput, setFocusedInput] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    visible:  false,
    type:     null,    // 'logout' | 'delete'
    noteId:   null,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Load notes ────────────────────────────────────────
  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'notes'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setNotes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadNotes(); }, []);

  // ── Status toast ──────────────────────────────────────
  const showStatus = (type) => {
    setSaveStatus(type);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setSaveStatus(''));
  };

  // ── Save note ─────────────────────────────────────────
  const handleSave = async () => {
    if (!noteText.trim()) return;
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        uid:       user.uid,
        text:      noteText.trim(),
        createdAt: serverTimestamp(),
      });
      setNotes((prev) => [{
        id: docRef.id, uid: user.uid,
        text: noteText.trim(),
        createdAt: { seconds: Date.now() / 1000 },
      }, ...prev]);
      setNoteText('');
      showStatus('success');
    } catch (err) {
      console.error('Save error:', err);
      showStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Open modals ───────────────────────────────────────
  const confirmLogout = () => setModal({ visible: true, type: 'logout', noteId: null });
  const confirmDelete = (noteId) => setModal({ visible: true, type: 'delete', noteId });
  const closeModal    = () => setModal({ visible: false, type: null, noteId: null });

  // ── Handle modal confirm ──────────────────────────────
  const handleModalConfirm = async () => {
    if (modal.type === 'logout') {
      closeModal();
      setTimeout(() => logout(), 200); // small delay for smooth animation
    }
    if (modal.type === 'delete') {
      const id = modal.noteId;
      closeModal();
      try {
        await deleteDoc(doc(db, 'notes', id));
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  // ── Helpers ───────────────────────────────────────────
  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?';

  // ─────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Custom Confirm Modal ─────────────────────── */}
      <ConfirmModal
        visible={modal.visible}
        title={modal.type === 'logout' ? 'Sign Out' : 'Delete Note'}
        message={
          modal.type === 'logout'
            ? 'You will be returned to the login screen. Any unsaved changes will be lost.'
            : 'This note will be permanently deleted and cannot be recovered.'
        }
        icon={modal.type === 'logout' ? '👋' : '🗑️'}
        confirmText={modal.type === 'logout' ? 'Sign Out' : 'Delete'}
        confirmColor={modal.type === 'logout' ? C.primary : C.danger}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
      />

      {/* ── Top Bar ──────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Good to see you</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Page Title ──────────────────────────────── */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>My Notes</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{notes.length}</Text>
          </View>
        </View>

        {/* ── Input Card ──────────────────────────────── */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardLabel}>NEW NOTE</Text>
          <TextInput
            style={[styles.noteInput, focusedInput && styles.noteInputFocus]}
            placeholder="What's on your mind?"
            placeholderTextColor={C.textMuted}
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={4}
            maxLength={500}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{noteText.length}/500</Text>

          {/* Status toast */}
          {!!saveStatus && (
            <Animated.View style={[
              styles.statusBadge,
              saveStatus === 'success' ? styles.statusSuccess : styles.statusError,
              { opacity: fadeAnim },
            ]}>
              <Text style={styles.statusText}>
                {saveStatus === 'success' ? '✓  Note saved!' : '✕  Failed to save'}
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, (!noteText.trim() || isSaving) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!noteText.trim() || isSaving}
            activeOpacity={0.85}
          >
            {isSaving
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.saveBtnText}>＋  Save to Firebase</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Notes List ──────────────────────────────── */}
        <Text style={styles.sectionLabel}>SAVED NOTES</Text>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={C.primary} />
            <Text style={styles.loadingText}>Loading your notes...</Text>
          </View>
        ) : notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptySubtitle}>Write your first note above and save it!</Text>
          </View>
        ) : (
          notes.map((note, index) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteIndexBadge}>
                  <Text style={styles.noteIndexText}>#{notes.length - index}</Text>
                </View>
                <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(note.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          ))
        )}

        <View style={{ height: S.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:          { flex: 1, backgroundColor: C.background },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: S.lg, paddingBottom: S.xl },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 48,
    paddingHorizontal: S.lg, paddingBottom: S.md,
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  userInfo:   { flexDirection: 'row', alignItems: 'center', gap: S.sm, flex: 1 },
  avatar: {
    width: 42, height: 42, borderRadius: R.full,
    backgroundColor: C.primaryGlow, borderWidth: 1.5, borderColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText:  { color: C.primary, fontSize: F.lg, fontWeight: F.bold },
  greeting:    { color: C.textMuted, fontSize: F.xs, fontWeight: F.medium },
  userEmail:   { color: C.textPrimary, fontSize: F.sm, fontWeight: F.semiBold, maxWidth: 180 },
  logoutBtn: {
    paddingHorizontal: S.md, paddingVertical: S.xs + 2,
    borderRadius: R.full, borderWidth: 1, borderColor: C.danger,
  },
  logoutText: { color: C.danger, fontSize: F.xs, fontWeight: F.bold, letterSpacing: 0.5 },

  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginTop: S.lg, marginBottom: S.md },
  pageTitle: { fontSize: F.xxl, fontWeight: F.extraBold, color: C.textPrimary, letterSpacing: -0.5 },
  countBadge: {
    backgroundColor: C.primaryGlow, borderRadius: R.full,
    paddingHorizontal: S.sm, paddingVertical: 2,
    borderWidth: 1, borderColor: C.primary,
  },
  countText: { color: C.primary, fontSize: F.xs, fontWeight: F.bold },

  inputCard: {
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border,
    padding: S.md, marginBottom: S.lg,
  },
  inputCardLabel: {
    fontSize: F.xs, fontWeight: F.bold, color: C.textSecondary,
    letterSpacing: 1.2, marginBottom: S.sm,
  },
  noteInput: {
    backgroundColor: C.surfaceAlt, borderRadius: R.md,
    borderWidth: 1, borderColor: C.border,
    padding: S.md, fontSize: F.md, color: C.textPrimary, minHeight: 100,
  },
  noteInputFocus: { borderColor: C.borderFocus },
  charCount: {
    textAlign: 'right', color: C.textMuted,
    fontSize: F.xs, marginTop: S.xs, marginBottom: S.sm,
  },

  statusBadge:   { borderRadius: R.sm, paddingHorizontal: S.md, paddingVertical: S.xs + 2, marginBottom: S.sm },
  statusSuccess: { backgroundColor: C.successGlow, borderWidth: 1, borderColor: C.success },
  statusError:   { backgroundColor: C.dangerGlow,  borderWidth: 1, borderColor: C.danger  },
  statusText:    { fontSize: F.sm, fontWeight: F.semiBold, color: C.textPrimary },

  saveBtn: {
    backgroundColor: C.primary, borderRadius: R.md,
    paddingVertical: S.md, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveBtnDisabled: { opacity: 0.4, shadowOpacity: 0 },
  saveBtnText:     { color: '#FFF', fontSize: F.md, fontWeight: F.bold, letterSpacing: 0.3 },

  sectionLabel: {
    fontSize: F.xs, fontWeight: F.bold, color: C.textSecondary,
    letterSpacing: 1.2, marginBottom: S.md,
  },

  loadingWrap:   { alignItems: 'center', paddingVertical: S.xl, gap: S.sm },
  loadingText:   { color: C.textMuted, fontSize: F.sm },

  emptyState:    { alignItems: 'center', paddingVertical: S.xxl },
  emptyIcon:     { fontSize: 48, marginBottom: S.md },
  emptyTitle:    { fontSize: F.lg, fontWeight: F.bold, color: C.textSecondary, marginBottom: S.xs },
  emptySubtitle: { fontSize: F.sm, color: C.textMuted, textAlign: 'center' },

  noteCard: {
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border,
    padding: S.md, marginBottom: S.md,
  },
  noteHeader:     { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginBottom: S.sm },
  noteIndexBadge: { backgroundColor: C.primaryGlow, borderRadius: R.full, paddingHorizontal: S.sm, paddingVertical: 2 },
  noteIndexText:  { color: C.primary, fontSize: F.xs, fontWeight: F.bold },
  noteDate:       { flex: 1, color: C.textMuted, fontSize: F.xs },
  deleteBtn: {
    width: 28, height: 28, borderRadius: R.full,
    backgroundColor: C.dangerGlow, borderWidth: 1, borderColor: C.danger,
    justifyContent: 'center', alignItems: 'center',
  },
  deleteBtnText: { color: C.danger, fontSize: F.xs, fontWeight: F.bold },
  noteText:      { color: C.textPrimary, fontSize: F.md, lineHeight: 22 },
});