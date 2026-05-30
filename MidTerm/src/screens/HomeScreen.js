import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Image, StatusBar, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStudent } from '../context/AppContext';

const StatCard = ({ label, value, icon, theme, COLORS }) => (
  <View style={[statStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <Ionicons name={icon} size={20} color={COLORS.accent} style={{ marginBottom: 6 }} />
    <Text style={[statStyles.value, { color: theme.text }]}>{value}</Text>
    <Text style={[statStyles.label, { color: theme.subtext }]}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  card: {
    flex: 1, marginHorizontal: 5, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  value: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 11, marginTop: 2, letterSpacing: 0.8 },
});

export default function HomeScreen({ navigation }) {
  const { theme, COLORS } = useTheme();
  const { student, updateStudent } = useStudent();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // useEffect: load student data + set time greeting
  useEffect(() => {
    const init = async () => {
      try {
        const saved = await AsyncStorage.getItem('student_data');
        if (saved) await updateStudent(JSON.parse(saved));
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    init();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const styles = makeStyles(theme, COLORS);

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ─── Top Bar ─── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.welcomeName}>{student.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.85}
          >
            {student.profilePic
              ? <Image source={{ uri: student.profilePic }} style={styles.avatar} />
              : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={26} color={COLORS.accent} />
                </View>
              )}
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={9} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Student ID Card ─── */}
        <View style={styles.idCard}>
          <View style={styles.idCardLeft}>
            <Text style={styles.idCardUni}>Riphah International University</Text>
            <Text style={styles.idCardName}>{student.name}</Text>
            <View style={styles.idRow}>
              <Ionicons name="card-outline" size={13} color={theme.subtext} />
              <Text style={styles.idCardSub}>  SAP ID: {student.sapId}</Text>
            </View>
            <View style={styles.idRow}>
              <Ionicons name="calendar-outline" size={13} color={theme.subtext} />
              <Text style={styles.idCardSub}>  Semester {student.semester}</Text>
            </View>
          </View>
          <View style={styles.idCardRight}>
            <View style={styles.idAvatarLarge}>
              {student.profilePic
                ? <Image source={{ uri: student.profilePic }} style={styles.idAvatarImg} />
                : <Ionicons name="person" size={36} color={COLORS.accent} />}
            </View>
          </View>
        </View>

        {/* ─── Stats Row ─── */}
        <Text style={styles.sectionTitle}>Academic Overview</Text>
        <View style={styles.statsRow}>
          <StatCard label="GPA" value={student.gpa} icon="trending-up" theme={theme} COLORS={COLORS} />
          <StatCard label="CGPA" value={student.cgpa} icon="star" theme={theme} COLORS={COLORS} />
          <StatCard label="Courses" value={student.enrolledCourses?.length || 0} icon="book" theme={theme} COLORS={COLORS} />
        </View>

        {/* ─── Quick Actions ─── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { label: 'Edit Profile', icon: 'create-outline', screen: 'EditProfile' },
            { label: 'My Courses', icon: 'library-outline', screen: 'Courses' },
            { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
            { label: 'About Dev', icon: 'information-circle-outline', screen: 'About' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconWrap}>
                <Ionicons name={action.icon} size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.subtext} style={{ marginTop: 2 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Recent Courses Preview ─── */}
        <Text style={styles.sectionTitle}>Recent Courses</Text>
        {(student.enrolledCourses || []).slice(0, 3).map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.coursePreview}
            onPress={() => navigation.navigate('Courses')}
            activeOpacity={0.8}
          >
            <View style={styles.coursePreviewLeft}>
              <View style={styles.courseDot} />
              <View>
                <Text style={styles.courseName} numberOfLines={1}>{course.name}</Text>
                <Text style={styles.courseCode}>{course.code} · {course.timings}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate('Courses')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>View All Courses →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const makeStyles = (theme, COLORS) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 30 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { color: theme.subtext, fontSize: 13 },
  welcomeName: { color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.accent },
  avatarPlaceholder: { backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: theme.bg,
  },

  idCard: {
    flexDirection: 'row', backgroundColor: theme.card,
    borderRadius: 18, padding: 18, borderWidth: 1, borderColor: theme.border,
    marginBottom: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14,
  },
  idCardLeft: { flex: 1 },
  idCardUni: { color: COLORS.accent, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  idCardName: { color: theme.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  idRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  idCardSub: { color: theme.subtext, fontSize: 13 },
  idCardRight: { justifyContent: 'center', paddingLeft: 12 },
  idAvatarLarge: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 2, borderColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  idAvatarImg: { width: 70, height: 70, borderRadius: 35 },

  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 4 },

  statsRow: { flexDirection: 'row', marginBottom: 22, marginHorizontal: -5 },

  actionsGrid: { marginBottom: 22 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.card, borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: theme.border,
  },
  actionIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(77,166,255,0.12)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  actionLabel: { flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' },

  coursePreview: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.card, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: theme.border,
  },
  coursePreviewLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  courseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginRight: 10 },
  courseName: { color: theme.text, fontSize: 13, fontWeight: '600', maxWidth: 220 },
  courseCode: { color: theme.subtext, fontSize: 11, marginTop: 2 },

  viewAllBtn: { alignItems: 'center', marginTop: 4 },
  viewAllText: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
});
