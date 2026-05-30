import { StyleSheet } from 'react-native';

export const globalStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 16 },
  title: { fontSize: 26, fontWeight: '800', color: theme.text },
  subtitle: { fontSize: 18, fontWeight: '700', color: theme.text },
  body: { fontSize: 14, color: theme.subtext },
  card: {
    backgroundColor: theme.card, borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  primaryButton: {
    backgroundColor: theme.primary, paddingVertical: 14,
    paddingHorizontal: 24, borderRadius: 14, alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  input: {
    backgroundColor: theme.inputBg, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 14,
    color: theme.text, borderWidth: 1, borderColor: theme.border,
    marginBottom: 12,
  },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: -8, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: theme.primary, paddingTop: 55, paddingBottom: 16,
    paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
});
