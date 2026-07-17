import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { theme } from '@/constants/theme';
import type { PondStatus } from '@/data/mockPonds';

// Colored badge for Healthy/Disease/Pending states.
export function StatusBadge({ status }: { status: PondStatus }) {
  const { bg, fg } = getColors(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: fg }]}> 
      <ThemedText style={[styles.text, { color: fg }]}>{status}</ThemedText>
    </View>
  );
}

function getColors(status: PondStatus) {
  switch (status) {
    case 'Healthy':
      return { bg: `${theme.colors.success}14`, fg: theme.colors.success };
    case 'Disease':
      return { bg: `${theme.colors.danger}14`, fg: theme.colors.danger };
    case 'Pending':
    default:
      return { bg: `${theme.colors.warning}14`, fg: theme.colors.warning };
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: { fontWeight: '700', fontSize: 12 },
});

