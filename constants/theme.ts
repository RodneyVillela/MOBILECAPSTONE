import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#0F766E',
    accent: '#F97316',
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#D97706',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    screenTitle: 28,
    sectionTitle: 18,
    body: 15,
    caption: 13,
  },
};

export const Colors = {
  light: {
    text: theme.colors.textPrimary,
    background: theme.colors.background,
    tint: theme.colors.primary,
    icon: theme.colors.textSecondary,
    tabIconDefault: theme.colors.textSecondary,
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    success: theme.colors.success,
    danger: theme.colors.danger,
    warning: theme.colors.warning,
    surface: theme.colors.surface,
    border: theme.colors.border,
  },
  dark: {
    text: '#E2E8F0',
    background: '#0F172A',
    tint: theme.colors.primary,
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    success: theme.colors.success,
    danger: theme.colors.danger,
    warning: theme.colors.warning,
    surface: '#111827',
    border: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
