// frontend/components/ConfirmModal.js

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, Animated, TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../styles/theme';

const C = theme.colors;
const F = theme.fonts;
const S = theme.spacing;
const R = theme.radius;

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText    = 'Confirm',
  cancelText     = 'Cancel',
  confirmColor   = C.danger,
  icon           = '⚠️',
  onConfirm,
  onCancel,
}) {
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 300,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Backdrop — tap outside to cancel */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>

          {/* Card — stop tap from bubbling to backdrop */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View style={[
              styles.card,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
            ]}>

              {/* Icon Circle */}
              <View style={[
                styles.iconCircle,
                { backgroundColor: confirmColor + '18', borderColor: confirmColor + '40' }
              ]}>
                <Text style={styles.iconText}>{icon}</Text>
              </View>

              {/* Text */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Buttons */}
              <View style={styles.btnRow}>

                {/* Cancel */}
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onCancel}
                  activeOpacity={0.75}
                >
                  <Text style={styles.cancelBtnText}>{cancelText}</Text>
                </TouchableOpacity>

                {/* Confirm */}
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: confirmColor }]}
                  onPress={onConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>{confirmText}</Text>
                </TouchableOpacity>

              </View>
            </Animated.View>
          </TouchableWithoutFeedback>

        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: S.lg,
  },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: R.xl,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },

  // Icon
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: R.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: S.md,
  },
  iconText: { fontSize: 32 },

  // Text
  title: {
    fontSize: F.xl,
    fontWeight: F.bold,
    color: C.textPrimary,
    marginBottom: S.xs,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: F.md,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: S.sm,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: C.border,
    width: '100%',
    marginVertical: S.lg,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: S.sm,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: S.md,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceAlt,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: C.textSecondary,
    fontSize: F.md,
    fontWeight: F.semiBold,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: S.md,
    borderRadius: R.md,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: F.md,
    fontWeight: F.bold,
  },
});