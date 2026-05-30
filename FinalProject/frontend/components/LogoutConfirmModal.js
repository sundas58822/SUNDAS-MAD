import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { globalStyles } from '../globalStyling';

export default function LogoutConfirmModal({ visible, onConfirm, onCancel }) {
  const { theme } = useTheme();
  const g = globalStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🐾</Text>
            <Text style={[g.subtitle, { textAlign: 'center' }]}>Ready to go?</Text>
          </View>

          <Text style={[g.body, { textAlign: 'center', marginBottom: 24, color: theme.subtext }]}>
            Are you sure you want to logout from PetParadise?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.border }]}
              onPress={onCancel}
            >
              <Text style={[g.primaryButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton, { backgroundColor: theme.primary }]}
              onPress={onConfirm}
            >
              <Text style={g.primaryButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButton: {
    flex: 1,
  },
});
