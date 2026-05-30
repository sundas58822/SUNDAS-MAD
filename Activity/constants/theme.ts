import { Platform } from "react-native";

// Purple + Black Theme
const tintColorLight = "#8B5CF6";
const tintColorDark = "#C4B5FDw";

export const Colors = {
  light: {
    text: "#1F1F1F",
    background: "#b770b7",
    tint: tintColorLight,
    icon: "#6B7280",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#b770b7",
    background: "#0F0F0F",
    tint: tintColorDark,
    icon: "#A1A1AA",
    tabIconDefault: "#71717A",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
