import { StyleSheet, Text, type TextProps } from 'react-native';

import { theme } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  defaultSemiBold: {
    fontSize: theme.typography.body,
    lineHeight: 22,
    fontWeight: '600',
  },
  title: {
    fontSize: theme.typography.screenTitle,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: theme.typography.sectionTitle,
    fontWeight: '700',
  },
  link: {
    lineHeight: 30,
    fontSize: theme.typography.body,
    color: theme.colors.primary,
  },
});
