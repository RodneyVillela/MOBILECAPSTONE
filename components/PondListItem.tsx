import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { StatusBadge } from '@/components/StatusBadge';
import { theme } from '@/constants/theme';
import type { Pond } from '@/data/mockPonds';

// Row item for pond lists.
export function PondListItem({
  pond,
  lastFeedTime,
  onPress,
}: {
  pond: Pond;
  lastFeedTime?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.info}>
          <ThemedText style={styles.name}>{pond.name}</ThemedText>
          <ThemedText style={styles.meta}>
            {lastFeedTime ? `Last feed: ${lastFeedTime}` : 'No feed log yet'}
          </ThemedText>
        </View>
        <StatusBadge status={pond.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    width: '100%',
    marginBottom: theme.spacing.sm,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { color: theme.colors.textSecondary, fontSize: 13 },
});

