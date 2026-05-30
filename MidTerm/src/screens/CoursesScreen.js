import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, StatusBar, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStudent } from '../context/AppContext';

const COURSE_ICONS = ['book-outline', 'code-slash-outline', 'server-outline', 'globe-outline', 'layers-outline', 'wifi-outline', 'hardware-chip-outline'];
const COURSE_COLORS = ['#4da6ff', '#7c4dff', '#00bcd4', '#4caf50', '#ff9800', '#e91e63', '#ff5722'];

const CourseCard = ({ course, index, onPress, theme, COLORS }) => {
  const iconColor = COURSE_COLORS[index % COURSE_COLORS.length];
  const iconName = COURSE_ICONS[index % COURSE_ICONS.length];
  return (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onPress(course, index)}
      activeOpacity={0.82}
    >
      <View style={[styles.courseIconBox, { backgroundColor: iconColor + '22', borderColor: iconColor + '44' }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.courseInfo}>
        <Text style={[styles.courseName, { color: theme.text }]} numberOfLines={2}>{course.name}</Text>
        <Text style={[styles.courseCode, { color: COLORS.accent }]}>{course.code}</Text>
        <View style={styles.courseRow}>
          <Ionicons name="time-outline" size={12} color={theme.subtext} />
          <Text style={[styles.courseTiming, { color: theme.subtext }]}> {course.timings}</Text>
        </View>
        <View style={styles.courseRow}>
          <Ionicons name="school-outline" size={12} color={theme.subtext} />
          <Text style={[styles.courseTiming, { color: theme.subtext }]}> {course.credit} Credit Hours</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
    </TouchableOpacity>
  );
};

export default function CoursesScreen({ navigation }) {
  const { theme, COLORS } = useTheme();
  const { student } = useStudent();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const courses = student.enrolledCourses || [];

  const openCourse = (course, index) => {
    setSelectedCourse(course);
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const s = makeStyles(theme, COLORS);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* ─── Header ─── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Enrolled Courses</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{courses.length}</Text>
        </View>
      </View>

      {/* ─── Stats Row ─── */}
      <View style={s.statsRow}>
        <View style={[s.statBox, { borderColor: theme.border }]}>
          <Text style={[s.statVal, { color: theme.text }]}>{courses.length}</Text>
          <Text style={[s.statLbl, { color: theme.subtext }]}>Courses</Text>
        </View>
        <View style={[s.statBox, { borderColor: theme.border }]}>
          <Text style={[s.statVal, { color: theme.text }]}>
            {courses.reduce((acc, c) => acc + (c.credit || 3), 0)}
          </Text>
          <Text style={[s.statLbl, { color: theme.subtext }]}>Credit Hours</Text>
        </View>
        <View style={[s.statBox, { borderColor: theme.border }]}>
          <Text style={[s.statVal, { color: theme.text }]}>{student.semester}</Text>
          <Text style={[s.statLbl, { color: theme.subtext }]}>Semester</Text>
        </View>
      </View>

      {/* ─── Course List ─── */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item} index={index}
            onPress={openCourse}
            theme={theme} COLORS={COLORS}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="book-outline" size={48} color={theme.subtext} />
            <Text style={[s.emptyText, { color: theme.subtext }]}>No enrolled courses found.</Text>
          </View>
        }
      />

      {/* ─── Course Detail Modal ─── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            {selectedCourse && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={s.modalTop}>
                  <View style={[s.modalIcon, {
                    backgroundColor: COURSE_COLORS[selectedIndex % COURSE_COLORS.length] + '22',
                    borderColor: COURSE_COLORS[selectedIndex % COURSE_COLORS.length] + '55',
                  }]}>
                    <Ionicons
                      name={COURSE_ICONS[selectedIndex % COURSE_ICONS.length]}
                      size={34}
                      color={COURSE_COLORS[selectedIndex % COURSE_COLORS.length]}
                    />
                  </View>
                  <TouchableOpacity style={s.closeBtn} onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                    <Ionicons name="close" size={20} color={theme.text} />
                  </TouchableOpacity>
                </View>
                <Text style={[s.modalTitle, { color: theme.text }]}>{selectedCourse.name}</Text>
                <Text style={[s.modalCode, { color: COLORS.accent }]}>{selectedCourse.code}</Text>

                {[
                  { icon: 'time-outline', label: 'Timings', value: selectedCourse.timings },
                  { icon: 'school-outline', label: 'Credit Hours', value: `${selectedCourse.credit} Hours` },
                  { icon: 'calendar-outline', label: 'Semester', value: student.semester },
                  { icon: 'person-outline', label: 'Student', value: student.name },
                  { icon: 'card-outline', label: 'SAP ID', value: student.sapId },
                ].map((row) => (
                  <View key={row.label} style={[s.detailRow, { borderColor: theme.border }]}>
                    <View style={[s.detailIcon, { backgroundColor: 'rgba(77,166,255,0.10)' }]}>
                      <Ionicons name={row.icon} size={16} color={COLORS.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.detailLabel, { color: theme.subtext }]}>{row.label}</Text>
                      <Text style={[s.detailValue, { color: theme.text }]}>{row.value}</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={[s.doneBtn, { backgroundColor: COLORS.accent }]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.85}
                >
                  <Text style={s.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (theme, COLORS) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingBottom: 12, paddingHorizontal: 20,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: theme.text, fontSize: 18, fontWeight: '700' },
  badge: {
    backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, minWidth: 38, alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 10,
  },
  statBox: {
    flex: 1, backgroundColor: theme.card, borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1,
  },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLbl: { fontSize: 10, letterSpacing: 0.5, marginTop: 2 },

  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  courseCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16,
    padding: 14, marginBottom: 10, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 8,
  },
  courseIconBox: {
    width: 50, height: 50, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginRight: 12, borderWidth: 1,
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  courseCode: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  courseRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  courseTiming: { fontSize: 11 },

  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, marginTop: 12 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, borderWidth: 1,
    maxHeight: '85%',
  },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalIcon: {
    width: 68, height: 68, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalCode: { fontSize: 14, fontWeight: '600', marginBottom: 18 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, paddingVertical: 12,
  },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  detailLabel: { fontSize: 11, letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  doneBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

const styles = StyleSheet.create({
  courseCard: {},
});
