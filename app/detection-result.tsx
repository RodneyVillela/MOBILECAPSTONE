import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';

// Shows scan result after disease analysis. (Step 7)
export default function DetectionResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ label?: string; confidence?: string; photoUri?: string }>();

  const label = params.label ?? 'Unknown';
  const confidence = params.confidence ? `${params.confidence}%` : '—';
  const photoUri = params.photoUri;

  const info = getDiseaseInfo(label);
  const tone = getTone(label);

  return (
    <ThemedView style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.thumbnail} />
      ) : (
        <ThemedView style={styles.thumbnailPlaceholder}>
          <ThemedText>Photo</ThemedText>
        </ThemedView>
      )}

      <ThemedView style={[styles.banner, { backgroundColor: `${tone.color}14`, borderColor: tone.color }]}> 
        <ThemedText style={[styles.bannerText, { color: tone.color }]}>{label}</ThemedText>
        <ThemedText style={[styles.bannerSubtext, { color: tone.color }]}>{confidence} confidence</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Diagnostic summary</ThemedText>
        <ThemedText style={styles.bodyText}>{info.description}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recommended action</ThemedText>
        <ThemedText style={styles.bodyText}>{info.action}</ThemedText>
      </ThemedView>

      <ThemedView
        style={styles.secondaryButton}
        accessibilityRole="button"
        onTouchEnd={() => router.replace('/(tabs)/disease-detection')}>
        <ThemedText style={styles.secondaryButtonText}>Scan Another</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

function getTone(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes('healthy')) return { color: theme.colors.success };
  if (normalized.includes('black')) return { color: theme.colors.warning };
  if (normalized.includes('white')) return { color: theme.colors.danger };
  return { color: theme.colors.primary };
}

function getDiseaseInfo(label: string) {
  switch (label) {
    case 'White_Spot_Syndrome_Virus':
      return {
        description:
          'White spot syndrome virus can cause rapid mortality, visible white spots, and reduced appetite.',
        action:
          'Isolate affected stock, improve water quality, and contact a vet or aquaculture specialist for targeted treatment guidance.',
      };
    case 'Black_Gill':
      return {
        description:
          'Black gill indicates gill damage, often linked to poor water quality, low oxygen, or pathogenic stress.',
        action:
          'Check dissolved oxygen and ammonia/nitrite levels immediately, adjust aeration, and consider water treatment measures as advised by local guidelines.',
      };
    case 'Healthy':
    default:
      return {
        description:
          'No strong disease signal detected. Continue routine monitoring and follow farm biosecurity practices.',
        action:
          'Keep logging observations and feed schedules, and repeat scanning if symptoms appear.',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.background,
  },
  thumbnail: {
    width: '100%',
    height: 240,
    borderRadius: theme.radius.xl,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  banner: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginTop: theme.spacing.md,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSubtext: {
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  bodyText: {
    width: '100%',
    color: theme.colors.textSecondary,
  },
  secondaryButton: {
    marginTop: theme.spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

