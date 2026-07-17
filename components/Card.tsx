import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { theme } from '@/constants/theme';

// Reusable dashboard summary card.
export function Card({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const tone = getTone(title);

  return (
    <View style={[styles.card, { borderLeftColor: tone.color }, style]}> 
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: tone.background }]}> 
          <ThemedText style={{ color: tone.color }}>{tone.icon}</ThemedText>
        </View>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

function getTone(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes('feed')) {
    return { color: theme.colors.primary, background: `${theme.colors.primary}14`, icon: '🐟' };
  }
  if (normalized.includes('disease')) {
    return { color: theme.colors.danger, background: `${theme.colors.danger}14`, icon: '🩺' };
  }
  if (normalized.includes('harvest')) {
    return { color: theme.colors.warning, background: `${theme.colors.warning}14`, icon: '📈' };
  }
  return { color: theme.colors.accent, background: `${theme.colors.accent}14`, icon: '📊' };
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: theme.typography.sectionTitle,
  },
});

