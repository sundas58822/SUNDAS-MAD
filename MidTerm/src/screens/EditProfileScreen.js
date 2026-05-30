import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, StatusBar, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStudent } from '../context/AppContext';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const Field = ({ label, icon, value, onChangeText, keyboardType = 'default', theme, COLORS }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={[fS.label, { color: theme.subtext }]}>{label}</Text>
    <View style={[fS.inputRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
      <Ionicons name={icon} size={17} color={theme.subtext} style={{ marginRight: 8 }} />
      <TextInput
        style={[fS.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.subtext}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const fS = StyleSheet.create({
  label: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, minHeight: 48,
  },
  input: { flex: 1, fontSize: 15 },
});

export default function EditProfileScreen({ navigation }) {
  const { theme, COLORS } = useTheme();
  const { student, updateStudent } = useStudent();

  const [name, setName] = useState(student.name);
  const [sapId, setSapId] = useState(student.sapId);
  const [semester, setSemester] = useState(student.semester);
  const [gpa, setGpa] = useState(student.gpa);
  const [cgpa, setCgpa] = useState(student.cgpa);
  const [profilePic, setProfilePic] = useState(student.profilePic);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState(student.enrolledCourses || []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access.'); return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) setProfilePic(result.assets[0].uri);
  };

  const updateCourseName = (id, newName) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Name cannot be empty.'); return; }
    const gpaVal = parseFloat(gpa);
    const cgpaVal = parseFloat(cgpa);
    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4) { Alert.alert('Invalid GPA', 'GPA must be 0.00 – 4.00.'); return; }
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 4) { Alert.alert('Invalid CGPA', 'CGPA must be 0.00 – 4.00.'); return; }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    await updateStudent({ name, sapId, semester, gpa, cgpa, profilePic, enrolledCourses: courses });
    setSaving(false);
    Alert.alert('Saved', 'Profile updated successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const s = makeStyles(theme, COLORS);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Edit Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={s.avatarWrap}>
            {profilePic
              ? <Image source={{ uri: profilePic }} style={s.avatarImg} />
              : <View style={[s.avatarImg, s.avatarPlaceholder]}><Ionicons name="person" size={48} color={COLORS.accent} /></View>
            }
            <View style={s.cameraBtn}><Ionicons name="camera" size={14} color="#fff" /></View>
          </TouchableOpacity>
          <Text style={{ color: theme.subtext, fontSize: 12 }}>Tap to change photo</Text>
        </View>

        <View style={[s.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[s.sectionHeader, { color: theme.text }]}>Personal Info</Text>
          <Field label="Full Name" icon="person-outline" value={name} onChangeText={setName} theme={theme} COLORS={COLORS} />
          <Field label="SAP ID" icon="card-outline" value={sapId} onChangeText={setSapId} keyboardType="numeric" theme={theme} COLORS={COLORS} />
          <Field label="GPA (0.00 – 4.00)" icon="trending-up-outline" value={gpa} onChangeText={setGpa} keyboardType="decimal-pad" theme={theme} COLORS={COLORS} />
          <Field label="CGPA (0.00 – 4.00)" icon="star-outline" value={cgpa} onChangeText={setCgpa} keyboardType="decimal-pad" theme={theme} COLORS={COLORS} />
        </View>

        <View style={[s.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[s.sectionHeader, { color: theme.text }]}>Semester</Text>
          <View style={s.semGrid}>
            {SEMESTERS.map((sem) => (
              <TouchableOpacity
                key={sem}
                style={[s.semChip, { borderColor: semester === sem ? COLORS.accent : theme.border, backgroundColor: semester === sem ? COLORS.accent : 'rgba(255,255,255,0.07)' }]}
                onPress={() => setSemester(sem)}
                activeOpacity={0.8}
              >
                <Text style={{ color: semester === sem ? '#fff' : theme.subtext, fontSize: 13, fontWeight: '600' }}>{sem}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[s.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[s.sectionHeader, { color: theme.text }]}>Courses</Text>
          {courses.map((course, idx) => (
            <View key={course.id} style={[s.courseRow, { borderColor: theme.border }]}>
              <View style={[s.courseNum, { backgroundColor: COLORS.accent + '22' }]}>
                <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '800' }}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[s.courseInput, { color: theme.text, borderBottomColor: theme.border }]}
                  value={course.name}
                  onChangeText={(val) => updateCourseName(course.id, val)}
                  placeholderTextColor={theme.subtext}
                />
                <Text style={{ color: COLORS.accent, fontSize: 11 }}>{course.code} · {course.timings}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[s.saveBtn, { backgroundColor: COLORS.accent }]} onPress={handleSave} activeOpacity={0.85} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <><Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} /><Text style={s.saveBtnText}>Save Changes</Text></>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme, COLORS) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingBottom: 14, paddingHorizontal: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: theme.text, fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36 },
  avatarSection: { alignItems: 'center', marginBottom: 20, marginTop: 6 },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 2.5, borderColor: COLORS.accent },
  avatarPlaceholder: { backgroundColor: 'rgba(255,255,255,0.10)', alignItems: 'center', justifyContent: 'center' },
  cameraBtn: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.bg },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 14 },
  sectionHeader: { fontSize: 13, fontWeight: '700', marginBottom: 14 },
  semGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  semChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  courseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1 },
  courseNum: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 4, flexShrink: 0 },
  courseInput: { fontSize: 13, fontWeight: '600', paddingVertical: 4, borderBottomWidth: 1, marginBottom: 3 },
  saveBtn: { borderRadius: 14, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
