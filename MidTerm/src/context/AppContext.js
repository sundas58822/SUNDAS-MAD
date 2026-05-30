import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#0f3f67',
  white: '#ffffff',
  accent: '#4da6ff',
  cardBorder: 'rgba(255,255,255,0.2)',
  cardBg: 'rgba(255,255,255,0.08)',
  inputBg: 'rgba(255,255,255,0.12)',
  shadow: 'rgba(0,0,0,0.35)',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
};

const lightTheme = {
  bg: '#0f3f67',
  surface: 'rgba(255,255,255,0.10)',
  card: 'rgba(255,255,255,0.13)',
  text: '#ffffff',
  subtext: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.22)',
  inputBg: 'rgba(255,255,255,0.14)',
  accent: '#4da6ff',
  tabBar: '#0a2d4d',
  tabActive: '#4da6ff',
  tabInactive: 'rgba(255,255,255,0.45)',
  statusBar: 'light',
};

const darkTheme = {
  bg: '#06213a',
  surface: 'rgba(255,255,255,0.07)',
  card: 'rgba(255,255,255,0.09)',
  text: '#ffffff',
  subtext: 'rgba(255,255,255,0.60)',
  border: 'rgba(255,255,255,0.18)',
  inputBg: 'rgba(255,255,255,0.10)',
  accent: '#4da6ff',
  tabBar: '#041525',
  tabActive: '#4da6ff',
  tabInactive: 'rgba(255,255,255,0.35)',
  statusBar: 'light',
};

// ─── Default Student Data ──────────────────────────────────────────────────────
const DEFAULT_STUDENT = {
  name: 'Student Name',
  sapId: '00000',
  semester: '1st',
  gpa: '3.50',
  cgpa: '3.45',
  profilePic: null,
  enrolledCourses: [
    { id: '1', name: 'Mobile Application Development', code: 'CS-401', timings: 'Mon/Wed  9:00–10:30 AM', credit: 3 },
    { id: '2', name: 'Software Engineering', code: 'CS-302', timings: 'Tue/Thu  11:00 AM–12:30 PM', credit: 3 },
    { id: '3', name: 'Database Systems', code: 'CS-303', timings: 'Mon/Wed  1:00–2:30 PM', credit: 3 },
    { id: '4', name: 'Web Technologies', code: 'CS-305', timings: 'Tue/Thu  2:00–3:30 PM', credit: 3 },
    { id: '5', name: 'Operating Systems', code: 'CS-304', timings: 'Fri  10:00 AM–1:00 PM', credit: 3 },
    { id: '6', name: 'Computer Networks', code: 'CS-306', timings: 'Mon/Wed  3:00–4:30 PM', credit: 3 },
    { id: '7', name: 'Artificial Intelligence', code: 'CS-402', timings: 'Tue/Thu  9:00–10:30 AM', credit: 3 },
  ],
};

// ─── Contexts ──────────────────────────────────────────────────────────────────
export const ThemeContext = createContext(null);
export const StudentContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [student, setStudent] = useState(DEFAULT_STUDENT);

  // Load saved theme + student data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme !== null) setIsDark(savedTheme === 'dark');

        const savedStudent = await AsyncStorage.getItem('student_data');
        if (savedStudent !== null) setStudent(JSON.parse(savedStudent));
      } catch (e) {
        console.log('Load error:', e);
      }
    };
    loadData();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('app_theme', next ? 'dark' : 'light');
  };

  const updateStudent = async (newData) => {
    const merged = { ...student, ...newData };
    setStudent(merged);
    await AsyncStorage.setItem('student_data', JSON.stringify(merged));
  };

  const resetStudent = async () => {
    setStudent(DEFAULT_STUDENT);
    await AsyncStorage.removeItem('student_data');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, COLORS }}>
      <StudentContext.Provider value={{ student, updateStudent, resetStudent }}>
        {children}
      </StudentContext.Provider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useStudent = () => useContext(StudentContext);
