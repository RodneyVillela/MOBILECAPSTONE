import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/Card';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { useRouter } from 'expo-router';
import type { Pond } from '@/data/mockPonds';

// Home dashboard: shows feed consumption summary, disease alert status, and harvest prediction teaser.
export default function HomeDashboardScreen() {
  const router = useRouter();
  const { ponds, feedLogs, scanHistory } = useData();

  const todayTotalFeed = feedLogs.reduce((sum, f) => {
    const d = new Date(f.time);
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    return isToday ? sum + f.amount : sum;
  }, 0);

  const diseaseCount = ponds.filter((p) => p.status === 'Disease').length;
  const healthyCount = ponds.filter((p) => p.status === 'Healthy').length;

  const nearestPond = getNearestHarvestPond(ponds);
  const nearestEstimatedDays = nearestPond ? getDaysSinceStocked(nearestPond.stockedDate) : null;

  const weekFeed = useMemo(() => getLast7DayFeed(feedLogs), [feedLogs]);
  const recentActivities = useMemo(() => getRecentActivities(feedLogs, scanHistory), [feedLogs, scanHistory]);
  const maxWeekValue = Math.max(1, ...weekFeed.map((item) => item.total));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          ShrimPredict
        </ThemedText>
        <ThemedText style={styles.subtitle}>Farm dashboard</ThemedText>

        <Card title="Feed Consumption Summary (Today)">
          <ThemedText type="defaultSemiBold" style={styles.bigValue}>
            {todayTotalFeed.toFixed(1)} kg
          </ThemedText>
          <ThemedText style={styles.muted}>Total feed logged across ponds today.</ThemedText>
        </Card>

        <Card title="Disease Alert Status">
          <ThemedText style={styles.row}>
            <ThemedText type="defaultSemiBold">Healthy:</ThemedText> {healthyCount}
          </ThemedText>
          <ThemedText style={styles.row}>
            <ThemedText type="defaultSemiBold">Disease:</ThemedText> {diseaseCount}
          </ThemedText>
          <ThemedText style={styles.muted}>
            Tap “Disease Detection” to scan shrimp photos.
          </ThemedText>
        </Card>

        <Card title="Harvest Prediction Teaser">
          <ThemedText style={styles.muted}>
            {nearestPond
              ? `Nearest pond: ${nearestPond.name}`
              : 'Add pond stocking data to see estimates.'}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.bigValue}>
            {nearestEstimatedDays === null ? '—' : `${nearestEstimatedDays} days since stocked`}
          </ThemedText>
          <ThemedText style={styles.muted}>Open Harvest to get an estimated harvest date.</ThemedText>
        </Card>

        <ThemedView style={styles.reportsCard}>
          <ThemedText type="subtitle" style={styles.reportsTitle}>This Week</ThemedText>
          <ThemedView style={styles.chartRow}>
            {weekFeed.map((item) => (
              <ThemedView key={item.label} style={styles.chartBarWrap}>
                <ThemedView style={[styles.chartBar, { height: `${Math.max(10, (item.total / maxWeekValue) * 100)}%` }]} />
                <ThemedText style={styles.chartLabel}>{item.label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.reportsCard}>
          <ThemedText type="subtitle" style={styles.reportsTitle}>Recent Activity</ThemedText>
          {recentActivities.map((item) => (
            <ThemedView key={item.id} style={styles.activityRow}>
              <ThemedView style={[styles.activityIcon, { backgroundColor: item.kind === 'scan' ? `${theme.colors.warning}14` : `${theme.colors.primary}14` }]}>
                <ThemedText>{item.kind === 'scan' ? '🩺' : '🐟'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.activityTextWrap}>
                <ThemedText style={styles.activityTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.activityMeta}>{item.detail}</ThemedText>
              </ThemedView>
              <ThemedText style={styles.activityTime}>{item.time}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <TouchableOpacity style={styles.reportsButton} onPress={() => router.push('/(tabs)/reports')}>
          <ThemedText style={styles.reportsButtonText}>View Full Reports</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.quickNav}>
        <ThemedView
          style={styles.navButton}
          accessibilityRole="button"
          onTouchEnd={() => router.push('/(tabs)/feed-monitor')}>
          <ThemedText style={styles.navText}>Feed Monitor</ThemedText>
        </ThemedView>

        <ThemedView
          style={styles.navButton}
          accessibilityRole="button"
          onTouchEnd={() => router.push('/(tabs)/disease-detection')}>
          <ThemedText style={styles.navText}>Disease Detection</ThemedText>
        </ThemedView>

        <ThemedView
          style={styles.navButton}
          accessibilityRole="button"
          onTouchEnd={() => router.push('/(tabs)/harvest-prediction')}>
          <ThemedText style={styles.navText}>Harvest</ThemedText>
        </ThemedView>

        <ThemedView
          style={styles.navButton}
          accessibilityRole="button"
          onTouchEnd={() => router.push('/(tabs)/profile')}>
          <ThemedText style={styles.navText}>Profile</ThemedText>
        </ThemedView>
      </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function getNearestHarvestPond(ponds: Pond[]) {
  return ponds
    .slice()
    .sort((a, b) => new Date(b.stockedDate).getTime() - new Date(a.stockedDate).getTime())[0];
}

function getDaysSinceStocked(stockedDate: string) {
  const start = new Date(stockedDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function getLast7DayFeed(feedLogs: { amount: number; time: string }[]) {
  const now = new Date();
  const labels = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - index));
    return d.toLocaleDateString([], { weekday: 'short' });
  });

  return labels.map((label, index) => {
    const target = new Date(now);
    target.setDate(now.getDate() - (6 - index));
    const dayStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const total = feedLogs.reduce((sum, log) => {
      const time = new Date(log.time);
      return time >= dayStart && time < dayEnd ? sum + log.amount : sum;
    }, 0);
    return { label, total };
  });
}

function getRecentActivities(
  feedLogs: { amount: number; id: string; pondId: string; time: string }[],
  scanHistory: { id: string; label: string; confidence: number; timestamp: string }[]
) {
  const feedItems = feedLogs
    .slice()
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)
    .map((item) => ({
      id: `feed_${item.id}`,
      kind: 'feed' as const,
      title: `Feed log ${item.amount.toFixed(1)} kg`,
      detail: `Pond ${item.pondId}`,
      time: getRelativeTime(item.time),
      timestamp: item.time,
    }));

  const scanItems = scanHistory
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)
    .map((item) => ({
      id: `scan_${item.id}`,
      kind: 'scan' as const,
      title: item.label,
      detail: `Confidence ${Math.round(item.confidence * 100)}%`,
      time: getRelativeTime(item.timestamp),
      timestamp: item.timestamp,
    }));

  return [...feedItems, ...scanItems]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);
}

function getRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.max(1, Math.round(hours / 24));
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  bigValue: {
    fontSize: 24,
    marginBottom: 4,
    color: theme.colors.primary,
  },
  muted: {
    color: theme.colors.textSecondary,
  },
  row: {
    marginTop: 4,
    marginBottom: 2,
  },
  reportsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  reportsTitle: {
    marginBottom: theme.spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    height: 120,
  },
  chartBarWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBar: {
    width: '100%',
    maxWidth: 24,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    minHeight: 10,
  },
  chartLabel: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextWrap: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '700',
  },
  activityMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  activityTime: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  reportsButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  reportsButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  quickNav: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  navButton: {
    backgroundColor: `${theme.colors.primary}14`,
    borderColor: `${theme.colors.primary}40`,
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 999,
  },
  navText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
});

