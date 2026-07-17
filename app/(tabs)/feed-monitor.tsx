import React, { useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PondListItem } from '@/components/PondListItem';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';

// Feed Monitor: lists ponds with status + last feed time. (Step 6)
export default function FeedMonitorScreen() {
  const router = useRouter();
  const { ponds, feedLogs } = useData();

  const lastFeedByPondId = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const log of feedLogs) {
      const prev = map[log.pondId];
      if (!prev) {
        map[log.pondId] = log.time;
        continue;
      }
      if (new Date(log.time).getTime() > new Date(prev).getTime()) {
        map[log.pondId] = log.time;
      }
    }
    return map;
  }, [feedLogs]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Feed Monitor
      </ThemedText>
      <ThemedText style={styles.subtitle}>Keep feeding routines on track.</ThemedText>

      {ponds.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>🐠</ThemedText>
          <ThemedText style={styles.emptyTitle}>No feed logs yet</ThemedText>
          <ThemedText style={styles.emptyText}>Tap + to add one and start tracking.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={ponds}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PondListItem
              pond={item}
              lastFeedTime={
                lastFeedByPondId[item.id]
                  ? formatDateTime(lastFeedByPondId[item.id]!)
                  : undefined
              }
              onPress={() => router.push(`/pond/${item.id}`)}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        accessibilityRole="button"
        onPress={() => router.push('/add-feed-log')}>
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingBottom: 96,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.typography.sectionTitle,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  fabText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 24,
  },
});

