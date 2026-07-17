// Placeholder removed in Step 4+. Kept file so Expo Router template doesn't break.
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ExplorePlaceholder() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>—</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


