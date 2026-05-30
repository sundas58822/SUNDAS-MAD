import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/AppContext";

const RIPHAH_LOGO = require("../../assets/images/riphah logo.jpeg");

export default function AuthScreen({ navigation }) {
  const { theme, COLORS } = useTheme();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [sapId, setSapId] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const validate = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    if (mode === "signup" && !name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return false;
    }
    return true;
  };

  // ── Login ─────────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulate async auth check
      await new Promise((res) => setTimeout(res, 800));
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const found = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!found) {
        Alert.alert("Login Failed", "Invalid email or password.");
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem(
        "session",
        JSON.stringify({ email, loggedIn: true }),
      );
      await AsyncStorage.setItem(
        "student_data",
        JSON.stringify(found.studentData),
      );
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ────────────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      if (users.find((u) => u.email === email)) {
        Alert.alert("Account Exists", "This email is already registered.");
        setLoading(false);
        return;
      }
      const newStudentData = {
        name,
        sapId: sapId || "00000",
        email,
        semester: "1st",
        gpa: "0.00",
        cgpa: "0.00",
        profilePic: null,
        enrolledCourses: [
          {
            id: "1",
            name: "Mobile Application Development",
            code: "CS-401",
            timings: "Mon/Wed  9:00–10:30 AM",
            credit: 3,
          },
          {
            id: "2",
            name: "Software Engineering",
            code: "CS-302",
            timings: "Tue/Thu  11:00 AM–12:30 PM",
            credit: 3,
          },
          {
            id: "3",
            name: "Database Systems",
            code: "CS-303",
            timings: "Mon/Wed  1:00–2:30 PM",
            credit: 3,
          },
          {
            id: "4",
            name: "Web Technologies",
            code: "CS-305",
            timings: "Tue/Thu  2:00–3:30 PM",
            credit: 3,
          },
          {
            id: "5",
            name: "Operating Systems",
            code: "CS-304",
            timings: "Fri  10:00 AM–1:00 PM",
            credit: 3,
          },
          {
            id: "6",
            name: "Computer Networks",
            code: "CS-306",
            timings: "Mon/Wed  3:00–4:30 PM",
            credit: 3,
          },
          {
            id: "7",
            name: "Artificial Intelligence",
            code: "CS-402",
            timings: "Tue/Thu  9:00–10:30 AM",
            credit: 3,
          },
        ],
      };
      const updatedUsers = [
        ...users,
        { email, password, studentData: newStudentData },
      ];
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      await AsyncStorage.setItem(
        "session",
        JSON.stringify({ email, loggedIn: true }),
      );
      await AsyncStorage.setItem(
        "student_data",
        JSON.stringify(newStudentData),
      );
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  const styles = makeStyles(theme, COLORS);
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Image source={RIPHAH_LOGO} style={styles.logoImage} />
          </View>
          <Text style={styles.university}>Riphah International University</Text>
          <Text style={styles.appTitle}>Student Portal</Text>
          <Text style={styles.tagline}>Your academic journey, simplified.</Text>
        </View>

        {/* ─── Tab Toggle ─── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === "login" && styles.tabActive]}
            onPress={() => setMode("login")}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.tabText, mode === "login" && styles.tabTextActive]}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === "signup" && styles.tabActive]}
            onPress={() => setMode("signup")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                mode === "signup" && styles.tabTextActive,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Form Card ─── */}
        <View style={styles.card}>
          {mode === "signup" && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={theme.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.subtext}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <Text style={styles.label}>SAP ID</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="card-outline"
                  size={18}
                  color={theme.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 12345"
                  placeholderTextColor={theme.subtext}
                  value={sapId}
                  onChangeText={setSapId}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={theme.subtext}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="you@riphah.edu.pk"
              placeholderTextColor={theme.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={theme.subtext}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor={theme.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.subtext}
              />
            </TouchableOpacity>
          </View>

          {/* ─── Action Button ─── */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={mode === "login" ? handleLogin : handleSignup}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionBtnText}>
                {mode === "login" ? "Login" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          {/* ─── Switch Mode ─── */}
          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            style={styles.switchRow}
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text style={styles.switchLink}>
                {mode === "login" ? "Sign Up" : "Login"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme, COLORS) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.bg },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

    header: { alignItems: "center", paddingTop: 60, paddingBottom: 30 },
    logoWrapper: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: "rgb(255, 255, 255)",
      borderWidth: 1.5,
      borderColor: "rgb(255, 255, 255)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    logoImage: {
      width: 56,
      height: 56,
      resizeMode: "contain",
    },
    university: {
      color: theme.subtext,
      fontSize: 12,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    appTitle: {
      color: theme.text,
      fontSize: 30,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    tagline: { color: theme.subtext, fontSize: 13, marginTop: 6 },

    tabRow: {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 4,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 11,
      alignItems: "center",
    },
    tabActive: { backgroundColor: COLORS.accent },
    tabText: { color: theme.subtext, fontSize: 14, fontWeight: "600" },
    tabTextActive: { color: "#fff" },

    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 22,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
    },
    label: {
      color: theme.subtext,
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 6,
      marginTop: 14,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      minHeight: 48,
    },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, color: theme.text, fontSize: 15 },
    eyeBtn: { padding: 4 },

    actionBtn: {
      marginTop: 22,
      backgroundColor: COLORS.accent,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
    },
    actionBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.4,
    },

    switchRow: { marginTop: 16, alignItems: "center" },
    switchText: { color: theme.subtext, fontSize: 13 },
    switchLink: { color: COLORS.accent, fontWeight: "700" },
  });
