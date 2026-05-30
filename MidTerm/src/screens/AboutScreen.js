import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/AppContext";

// 👉 Add your image here if available
const DEVELOPER_PHOTO = null;
// const DEVELOPER_PHOTO = require("../assets/profile.jpg");

const InfoRow = ({ icon, label, value, theme, COLORS }) => (
  <View
    style={[
      rowS.row,
      { backgroundColor: theme.card, borderColor: theme.border },
    ]}
  >
    <View style={rowS.iconBox}>
      <Ionicons name={icon} size={18} color={COLORS.accent} />
    </View>

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={[rowS.label, { color: theme.subtext }]}>{label}</Text>
      <Text style={[rowS.value, { color: theme.text }]}>{value}</Text>
    </View>
  </View>
);

const rowS = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(77,166,255,0.12)",
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
});

export default function AboutScreen({ navigation }) {
  const { theme, COLORS } = useTheme();
  const s = makeStyles(theme, COLORS);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.bg}
        translucent={false}
      />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <Text style={s.headerTitle}>About Developer</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Hero Card */}
        <View style={s.heroCard}>
          <View style={s.photoBorder}>
            {DEVELOPER_PHOTO ? (
              <Image source={DEVELOPER_PHOTO} style={s.photo} />
            ) : (
              <View style={[s.photo, s.photoPlaceholder]}>
                <Ionicons name="person" size={52} color={COLORS.accent} />
              </View>
            )}
          </View>

          <Text style={s.devName}>Sundas Ambreen</Text>
          <Text style={s.devTitle}>Mobile Application Developer</Text>

          {/* Chip */}
          <View style={s.chipRow}>
            <View style={s.chip}>
              <Ionicons name="school-outline" size={13} color={COLORS.accent} />
              <Text style={[s.chipText, { color: COLORS.accent }]}>
                {" "}
                Riphah International University
              </Text>
            </View>
          </View>

          {/* Quote */}
          <View style={s.quoteBox}>
            <Text style={[s.quote, { color: theme.subtext }]}>
              "Building apps that solve real-world problems with clean and
              elegant code."
            </Text>
          </View>
        </View>

        {/* Developer Info */}
        <Text style={[s.sectionLabel, { color: theme.subtext }]}>
          Developer Info
        </Text>

        <InfoRow
          icon="person-outline"
          label="Full Name"
          value="Sundas Ambreen"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="card-outline"
          label="SAP ID"
          value="58822"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="school-outline"
          label="University"
          value="Riphah International University"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="laptop-outline"
          label="Program"
          value="BS Computer Science"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="code-slash-outline"
          label="Course"
          value="Mobile Application Development"
          theme={theme}
          COLORS={COLORS}
        />

        {/* Tech Stack */}
        <Text style={[s.sectionLabel, { color: theme.subtext }]}>
          Tech Stack
        </Text>

        <View style={s.techGrid}>
          {[
            { icon: "logo-react", label: "React Native", sub: "Frontend" },
            { icon: "phone-portrait-outline", label: "Expo", sub: "Platform" },
            { icon: "save-outline", label: "AsyncStorage", sub: "Storage" },
            { icon: "navigate-outline", label: "Navigation", sub: "Routing" },
            {
              icon: "color-palette-outline",
              label: "useContext",
              sub: "State",
            },
            {
              icon: "code-working-outline",
              label: "JavaScript",
              sub: "Language",
            },
          ].map((tech) => (
            <View key={tech.label} style={s.techItem}>
              <Ionicons name={tech.icon} size={22} color={COLORS.accent} />
              <Text style={[s.techLabel, { color: theme.text }]}>
                {tech.label}
              </Text>
              <Text style={[s.techSub, { color: theme.subtext }]}>
                {tech.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* App Info */}
        <Text style={[s.sectionLabel, { color: theme.subtext }]}>
          App Information
        </Text>

        <InfoRow
          icon="apps-outline"
          label="App Name"
          value="Student Portal"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="git-branch-outline"
          label="Version"
          value="1.0.0 (MVP)"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="calendar-outline"
          label="Build Year"
          value="2025"
          theme={theme}
          COLORS={COLORS}
        />
        <InfoRow
          icon="shield-checkmark-outline"
          label="Purpose"
          value="Midterm Project – MAD Course"
          theme={theme}
          COLORS={COLORS}
        />

        {/* Footer */}
        <View style={s.footer}>
          <Ionicons name="heart" size={16} color="#f44336" />
          <Text style={[s.footerText, { color: theme.subtext }]}>
            {" "}
            Made with love by Sundas Ambreen{" "}
          </Text>
          <Ionicons name="heart" size={16} color="#f44336" />
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme, COLORS) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 14,
      paddingHorizontal: 20,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    scroll: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    heroCard: {
      borderRadius: 22,
      padding: 24,
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 10,
      elevation: 8,
    },
    photoBorder: {
      padding: 4,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: COLORS.accent,
      marginBottom: 14,
      elevation: 6,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    photoPlaceholder: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    devName: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text,
    },
    devTitle: {
      fontSize: 13,
      color: theme.subtext,
      marginBottom: 10,
    },
    chipRow: {
      flexDirection: "row",
      marginBottom: 10,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.accent,
      margin: 4,
    },
    chipText: {
      fontSize: 12,
      fontWeight: "600",
    },
    quoteBox: {
      borderLeftWidth: 3,
      borderLeftColor: COLORS.accent,
      paddingLeft: 10,
      marginTop: 6,
    },
    quote: {
      fontSize: 13,
      fontStyle: "italic",
    },
    sectionLabel: {
      fontSize: 11,
      textTransform: "uppercase",
      marginTop: 18,
      marginBottom: 10,
    },
    techGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      borderWidth: 1,
      borderRadius: 18,
      borderColor: theme.border,
      backgroundColor: theme.card,
      padding: 10,
    },
    techItem: {
      width: "33.3%",
      alignItems: "center",
      paddingVertical: 10,
    },
    techLabel: {
      fontSize: 11,
      fontWeight: "700",
      marginTop: 4,
    },
    techSub: {
      fontSize: 9,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    footerText: {
      fontSize: 13,
    },
  });
