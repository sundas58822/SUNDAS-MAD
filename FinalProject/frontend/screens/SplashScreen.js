import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
        <Text style={{ fontSize: 90 }}>🐾</Text>
        <Text style={styles.name}>PetParadise</Text>
        <Text style={styles.tag}>Everything your pet deserves</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 42, fontWeight: '900', color: '#fff', marginTop: 12 },
  tag: { color: 'rgba(255,255,255,0.85)', marginTop: 8, fontSize: 16 },
});
