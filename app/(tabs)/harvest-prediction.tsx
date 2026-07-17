import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';

// Harvest Prediction. (Step 8)
export default function HarvestPredictionScreen() {
  const router = useRouter();

  const [daysSinceStocking, setDaysSinceStocking] = useState<string>('30');
  const [averageFeedRate, setAverageFeedRate] = useState<string>('1.5');

  const result = useMemo(() => {
    const d = Number(daysSinceStocking);
    const rate = Number(averageFeedRate);

    if (!Number.isFinite(d) || !Number.isFinite(rate) || d < 0 || rate <= 0) return null;

    const totalDays = 90;
    const remaining = Math.max(0, totalDays - d);

    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + remaining);

    const baseYield = 100;
    const expected = baseYield * (rate / 1.5);
    const low = expected * 0.85;
    const high = expected * 1.15;

    return {
      remainingDays: remaining,
      harvestDate,
      low,
      high,
    };
  }, [daysSinceStocking, averageFeedRate]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Harvest Prediction
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Estimate harvest timing and yield range from your current farm inputs.
      </ThemedText>

      <ThemedView style={styles.form}>
        <ThemedText style={styles.label}>Days since stocking</ThemedText>
        <TextInput
          value={daysSinceStocking}
          onChangeText={setDaysSinceStocking}
          keyboardType="numeric"
          placeholder="30"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
        />
        <ThemedView style={styles.presetRow}>
          {[20, 30, 45, 60].map((v) => (
            <ThemedView
              key={v}
              style={styles.preset}
              accessibilityRole="button"
              onTouchEnd={() => setDaysSinceStocking(String(v))}>
              <ThemedText style={styles.presetText}>{v}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedText style={styles.label}>Average feed rate</ThemedText>
        <TextInput
          value={averageFeedRate}
          onChangeText={setAverageFeedRate}
          keyboardType="numeric"
          placeholder="1.5"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
        />
        <ThemedView style={styles.presetRow}>
          {[1.0, 1.5, 2.0, 2.5].map((v) => (
            <ThemedView
              key={v}
              style={styles.preset}
              accessibilityRole="button"
              onTouchEnd={() => setAverageFeedRate(String(v))}>
              <ThemedText style={styles.presetText}>{v}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {result ? (
        <ThemedView style={styles.results}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Estimated harvest
          </ThemedText>
          <ThemedView style={styles.resultCard}>
            <ThemedText style={styles.resultBig}>{formatDate(result.harvestDate)}</ThemedText>
            <ThemedText style={styles.muted}>
              {result.remainingDays} days remaining (toy model)
            </ThemedText>
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Expected yield range
          </ThemedText>
          <ThemedView style={styles.resultCard}>
            <ThemedText style={styles.resultBig}>
              {result.low.toFixed(0)} kg – {result.high.toFixed(0)} kg
            </ThemedText>
            <ThemedText style={styles.muted}>Based on average feed rate input.</ThemedText>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedText style={styles.muted}>Enter valid values to see results.</ThemedText>
      )}

      <ThemedView style={styles.bottomHelp}>
        <ThemedText style={styles.muted}>
          For a production app, replace this with a scientifically grounded model.
        </ThemedText>
        <ThemedView
          accessibilityRole="button"
          onTouchEnd={() => router.push('/(tabs)/feed-monitor')}>
          <ThemedText style={styles.linkLike}>View feed logs</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

function formatDate(d: Date) {
  return d.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  label: {
    fontWeight: '700',
    marginTop: theme.spacing.sm,
  },
  input: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  preset: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: `${theme.colors.primary}14`,
  },
  presetText: { fontWeight: '700', color: theme.colors.primary },
  results: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    marginTop: theme.spacing.sm,
  },
  resultCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  resultBig: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  muted: {
    color: theme.colors.textSecondary,
  },
  bottomHelp: {
    marginTop: 'auto',
    gap: 6,
    paddingTop: theme.spacing.lg,
  },
  linkLike: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

