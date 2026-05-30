import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch,
  ScrollView, Alert, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStudent } from '../context/AppContext';

const SettingRow = ({ icon, label, sublabel, right, onPress, theme, COLORS, danger }) => (
  <TouchableOpacity
    style={[rowStyles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
    onPress={onPress}
    activeOpacity={onPress ? 0.8 : 1}
  >
    <View style={[rowStyles.iconWrap, { backgroundColor: danger ? 'rgba(244,67,54,0.12)' : 'rgba(77,166,255,0.12)' }]}>
      <Ionicons name={icon} size={20} color={danger ? '#f44336' : COLORS.accent} />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={[rowStyles.label, { color: danger ? '#f44336' : theme.text }]}>{label}</Text>
      {sublabel ? <Text style={[rowStyles.sub, { color: theme.subtext }]}>{sublabel}</Text> : null}
    </View>
    {right}
  </TouchableOpacity>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 1,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 1 },
});

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme, COLORS } = useTheme();
  const { student, resetStudent } = useStudent();
  const [notifs, setNotifs] = useState(false);

  // useEffect: load saved notification pref
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('notifs_pref');
      if (saved !== null) setNotifs(saved === 'true');
    };
    load();
  }, []);

  const handleNotifToggle = async (val) => {
    setNotifs(val);
    await AsyncStorage.setItem('notifs_pref', String(val));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('session');
          navigation.replace('Auth');
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently clear all your saved student data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: async () => {
            await resetStudent();
            await AsyncStorage.multiRemove(['student_data', 'app_theme', 'notifs_pref']);
            Alert.alert('Done', 'All data has been reset.');
          },
        },
      ]
    );
  };

  const styles = makeStyles(theme, COLORS);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ─── Appearance ─── */}
        <Text style={styles.sectionLabel}>Appearance</Text>
        <SettingRow
          icon={isDark ? 'moon' : 'sunny-outline'}
          label="Dark Mode"
          sublabel={isDark ? 'Dark theme active – applies to all screens' : 'Light theme active – applies to all screens'}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: COLORS.accent }}
              thumbColor="#fff"
            />
          }
          theme={theme} COLORS={COLORS}
        />

        {/* ─── Notifications ─── */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <SettingRow
          icon="notifications-outline"
          label="Notifications"
          sublabel="Push notifications for updates"
          right={
            <Switch
              value={notifs}
              onValueChange={handleNotifToggle}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: COLORS.accent }}
              thumbColor="#fff"
            />
          }
          theme={theme} COLORS={COLORS}
        />
        <SettingRow
          icon="person-circle-outline"
          label="Edit Profile"
          sublabel="Update your name, photo, GPA & more"
          right={<Ionicons name="chevron-forward" size={16} color={theme.subtext} />}
          onPress={() => navigation.navigate('EditProfile')}
          theme={theme} COLORS={COLORS}
        />
        <SettingRow
          icon="information-circle-outline"
          label="About Developer"
          sublabel="App info & developer details"
          right={<Ionicons name="chevron-forward" size={16} color={theme.subtext} />}
          onPress={() => navigation.navigate('About')}
          theme={theme} COLORS={COLORS}
        />

        {/* ─── Account ─── */}
        <Text style={styles.sectionLabel}>Account</Text>
        <SettingRow
          icon="refresh-circle-outline"
          label="Reset All Data"
          sublabel="Clears all saved student data from local storage"
          right={<Ionicons name="chevron-forward" size={16} color="#f44336" />}
          onPress={handleReset}
          theme={theme} COLORS={COLORS} danger
        />
        <SettingRow
          icon="log-out-outline"
          label="Logout"
          sublabel="Sign out of your account"
          right={<Ionicons name="chevron-forward" size={16} color="#f44336" />}
          onPress={handleLogout}
          theme={theme} COLORS={COLORS} danger
        />

        {/* ─── App Info ─── */}
        <View style={styles.appInfoBox}>
          <Ionicons name="school" size={24} color={COLORS.accent} />
          <Text style={styles.appInfoTitle}>Student Portal v1.0.0</Text>
          <Text style={styles.appInfoSub}>Riphah International University</Text>
          <Text style={styles.appInfoSub}>Built with React Native + Expo</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const makeStyles = (theme, COLORS) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingBottom: 14, paddingHorizontal: 20,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: theme.text, fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36 },
  sectionLabel: {
    color: theme.subtext, fontSize: 11, letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 10, marginTop: 18,
  },
  appInfoBox: {
    alignItems: 'center', paddingVertical: 24, marginTop: 10,
    backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border,
  },
  appInfoTitle: { color: theme.text, fontSize: 14, fontWeight: '700', marginTop: 8 },
  appInfoSub: { color: theme.subtext, fontSize: 12, marginTop: 3 },
});
