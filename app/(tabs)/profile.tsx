import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

// Profile: username + simple settings + logout. (Step 9)
export default function ProfileScreen() {
  const router = useRouter();
  const { username, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>

      <ThemedView style={styles.heroCard}>
        <ThemedView style={styles.avatar}>
          <ThemedText style={styles.avatarText}>👤</ThemedText>
        </ThemedView>
        <ThemedView style={styles.heroText}>
          <ThemedText type="subtitle">{username ?? 'Administrator'}</ThemedText>
          <ThemedText style={styles.subtitle}>ShrimPredict operator</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>

        <ThemedView style={styles.row}>
          <ThemedText style={styles.key}>App Version</ThemedText>
          <ThemedText style={styles.value}>1.0.0</ThemedText>
        </ThemedView>

        <ThemedView style={styles.row}>
          <ThemedText style={styles.key}>About</ThemedText>
          <ThemedText style={styles.value}>ShrimPredict (demo farm app)</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={styles.logoutButton}
        accessibilityRole="button"
        onTouchEnd={() => {
          logout();
          router.replace('/landing');
        }}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${theme.colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  heroText: {
    flex: 1,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  section: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.xs,
  },
  row: {
    gap: 4,
  },
  key: {
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  value: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: `${theme.colors.danger}08`,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '700',
  },
});

