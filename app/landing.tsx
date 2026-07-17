import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';

// Welcome/landing screen with a “Get Started” button.
export default function LandingScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.heroCard}>
        <ThemedView style={styles.iconCircle}>
          <ThemedText style={styles.iconText}>🐟</ThemedText>
        </ThemedView>
        <ThemedText type="title" style={styles.heroTitle}>
          ShrimPredict
        </ThemedText>
        <ThemedText style={styles.tagline}>
          Smart shrimp farm monitoring for healthier ponds and calmer decisions.
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={styles.button}
        accessibilityRole="button"
        onTouchEnd={() => router.push('/login')}>
        <ThemedText style={styles.buttonText}>Get Started</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  heroCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${theme.colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconText: {
    fontSize: 36,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: theme.colors.accent,
    shadowColor: '#0F172A',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

