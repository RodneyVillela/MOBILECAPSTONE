import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';

export default function ReportsScreen() {
  const router = useRouter();
  const { ponds, feedLogs, scanHistory } = useData();

  const stats = useMemo(() => getStats(ponds, feedLogs, scanHistory), [ponds, feedLogs, scanHistory]);
  const breakdown = useMemo(() => getBreakdown(scanHistory), [scanHistory]);
  const feedTrend = useMemo(() => getFeedTrend(feedLogs), [feedLogs]);
  const maxFeed = Math.max(1, ...feedTrend.map((item) => item.total));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          Analytics & Reports
        </ThemedText>
        <ThemedText style={styles.subtitle}>Overview of pond health, feed use, and scan activity.</ThemedText>

        <ThemedView style={styles.statsRow}>
          <Card title="Total Scans" style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats.totalScans}</ThemedText>
          </Card>
          <Card title="Healthy %" style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats.healthyPercent}%</ThemedText>
          </Card>
          <Card title="Disease Alerts" style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats.diseaseAlerts}</ThemedText>
          </Card>
          <Card title="Total Feed Logged" style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats.totalFeed.toFixed(1)} kg</ThemedText>
          </Card>
        </ThemedView>

        <ThemedView style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Disease Breakdown</ThemedText>
          {breakdown.map((item) => (
            <ThemedView key={item.label} style={styles.breakdownRow}>
              <ThemedView style={styles.breakdownLabelRow}>
                <ThemedText style={styles.breakdownLabel}>{item.label}</ThemedText>
                <ThemedText style={styles.breakdownValue}>{item.count} ({item.percent}%)</ThemedText>
              </ThemedView>
              <ThemedView style={styles.barTrack}>
                <ThemedView style={[styles.barFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Feed Trend</ThemedText>
          <ThemedView style={styles.chartRow}>
            {feedTrend.map((item) => (
              <ThemedView key={item.label} style={styles.chartBarWrap}>
                <ThemedView style={[styles.chartBar, { height: `${Math.max(10, (item.total / maxFeed) * 100)}%` }]} />
                <ThemedText style={styles.chartLabel}>{item.label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Pond Health Overview</ThemedText>
          {ponds.map((pond) => (
            <ThemedView key={pond.id} style={styles.pondRow}>
              <ThemedView style={styles.pondMeta}>
                <ThemedText style={styles.pondName}>{pond.name}</ThemedText>
                <ThemedText style={styles.pondMetaText}>
                  {getLastScanLabel(scanHistory, pond.id)}
                </ThemedText>
              </ThemedView>
              <StatusBadge status={pond.status} />
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Scan History</ThemedText>
          {scanHistory.length === 0 ? (
            <ThemedText style={styles.emptyText}>No scans recorded yet.</ThemedText>
          ) : (
            scanHistory.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyRow}
                onPress={() => router.push({ pathname: '/detection-result', params: { label: item.label, confidence: String(Math.round(item.confidence * 100) / 100), photoUri: item.imageUri } })}>
                <Image source={{ uri: item.imageUri }} style={styles.thumb} />
                <ThemedView style={styles.historyTextWrap}>
                  <ThemedText style={styles.historyLabel}>{item.label}</ThemedText>
                  <ThemedText style={styles.historyMeta}>{Math.round(item.confidence * 100)}% confidence • {formatDate(item.timestamp)}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function getStats(ponds: { status: string }[], feedLogs: { amount: number }[], scanHistory: { label: string }[]) {
  const totalScans = scanHistory.length;
  const healthyScans = scanHistory.filter((item) => item.label === 'Healthy').length;
  const healthyPercent = totalScans === 0 ? 0 : Math.round((healthyScans / totalScans) * 100);
  const diseaseAlerts = ponds.filter((pond) => pond.status === 'Disease').length;
  const totalFeed = feedLogs.reduce((sum, item) => sum + item.amount, 0);
  return { totalScans, healthyPercent, diseaseAlerts, totalFeed };
}

function getBreakdown(scanHistory: { label: string }[]) {
  const buckets = ['Healthy', 'Black_Gill', 'White_Spot_Syndrome_Virus'];
  const counts = buckets.map((label) => scanHistory.filter((item) => item.label === label).length);
  const total = counts.reduce((sum, value) => sum + value, 0);

  return buckets.map((label, index) => ({
    label: label === 'White_Spot_Syndrome_Virus' ? 'WSSV' : label.replace('_', ' '),
    count: counts[index],
    percent: total === 0 ? 0 : Math.round((counts[index] / total) * 100),
    color: label === 'Healthy' ? theme.colors.success : label === 'Black_Gill' ? theme.colors.warning : theme.colors.danger,
  }));
}

function getFeedTrend(feedLogs: { amount: number; time: string }[]) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const target = new Date(now);
    target.setDate(now.getDate() - (6 - index));
    const dayStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const total = feedLogs.reduce((sum, log) => {
      const time = new Date(log.time);
      return time >= dayStart && time < dayEnd ? sum + log.amount : sum;
    }, 0);
    return {
      label: target.toLocaleDateString([], { weekday: 'short' }),
      total,
    };
  });
}

function getLastScanLabel(scanHistory: { label: string; timestamp: string }[], pondId: string) {
  return scanHistory.length > 0 ? `Last scan: ${scanHistory[0].label}` : 'No scan yet';
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: '47%',
    marginBottom: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionCard: {
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
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  breakdownRow: {
    marginBottom: theme.spacing.md,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  breakdownLabel: {
    fontWeight: '700',
  },
  breakdownValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    height: 140,
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
  pondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pondMeta: {
    flex: 1,
  },
  pondName: {
    fontWeight: '700',
  },
  pondMetaText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
  },
  historyTextWrap: {
    flex: 1,
  },
  historyLabel: {
    fontWeight: '700',
  },
  historyMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
});
