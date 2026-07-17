import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useData } from '@/context/DataContext';

// Pond details screen: shows that pond's feed history. (Step 6)
export default function PondDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ponds, feedLogs } = useData();

  const pond = ponds.find((p) => p.id === id);

  const history = useMemo(() => {
    return feedLogs
      .filter((l) => l.pondId === id)
      .slice()
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [feedLogs, id]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {pond ? pond.name : `Pond ${id}`}
      </ThemedText>
      <ThemedText style={styles.subtitle}>Feed history</ThemedText>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>No feed logs yet.</ThemedText>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <ThemedText style={styles.amount}>{item.amount.toFixed(1)} kg</ThemedText>
            <ThemedText style={styles.time}>{formatDateTime(item.time)}</ThemedText>
          </View>
        )}
      />
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
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  empty: {
    opacity: 0.75,
  },
  row: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  amount: {
    fontWeight: '900',
    marginBottom: 4,
  },
  time: {
    opacity: 0.85,
  },
});

