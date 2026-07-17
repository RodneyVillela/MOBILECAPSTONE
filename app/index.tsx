import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Splash screen: shows app name/logo and redirects to /landing after ~1.5s.
export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/landing');
    }, 1500);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      {/* Reuse existing asset later in Step 3 if desired */}
      <ThemedText type="title" style={styles.title}>
        ShrimPredict
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 26,
  },
});

