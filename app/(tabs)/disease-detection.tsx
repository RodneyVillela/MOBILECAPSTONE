import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BASE_URL } from '@/constants/config';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';

// Disease Detection (core feature): photo capture/gallery + backend classification. (Step 7)
export default function DiseaseDetectionScreen() {
  const router = useRouter();
  const { addScanHistoryEntry } = useData();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPerms = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cam.status !== 'granted' || media.status !== 'granted') {
      throw new Error('Camera/media library permissions are required.');
    }
  };

  const pickFromCamera = async () => {
    setError(null);
    await requestPerms();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (uri) setPhotoUri(uri);
    }
  };

  const pickFromLibrary = async () => {
    setError(null);
    await requestPerms();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (uri) setPhotoUri(uri);
    }
  };

  const analyze = async () => {
    if (!photoUri) return;

    setAnalyzing(true);
    setError(null);
    try {
      const fileRes = await fetch(photoUri);
      const blob = await fileRes.blob();

      const form = new FormData();
      form.append('image', blob as any, 'upload.jpg');

      const res = await fetch(`${BASE_URL}/api/detect`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Backend error (${res.status}): ${text || res.statusText}`);
      }

      const data: { label: string; confidence: number } = await res.json();

      addScanHistoryEntry({
        imageUri: photoUri,
        label: data.label,
        confidence: typeof data.confidence === 'number' ? data.confidence : 0,
        timestamp: new Date().toISOString(),
      });

      router.push({
        pathname: '/detection-result',
        params: {
          label: data.label,
          confidence: String(Math.round(data.confidence * 100) / 100),
          photoUri,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analyze failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Disease Detection
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Capture a shrimp photo and let the model classify the health status.
      </ThemedText>

      <ThemedView style={styles.actions}>
        <ThemedView style={styles.actionButton} accessibilityRole="button" onTouchEnd={pickFromCamera}>
          <ThemedText style={styles.actionIcon}>📷</ThemedText>
          <ThemedText style={styles.actionText}>Take Photo</ThemedText>
        </ThemedView>
        <ThemedView style={styles.actionButton} accessibilityRole="button" onTouchEnd={pickFromLibrary}>
          <ThemedText style={styles.actionIcon}>🖼️</ThemedText>
          <ThemedText style={styles.actionText}>Choose from Gallery</ThemedText>
        </ThemedView>
      </ThemedView>

      {photoUri ? (
        <ThemedView style={styles.previewWrap}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <ThemedView style={[styles.analyzeButton, analyzing ? styles.analyzeButtonDisabled : null]} accessibilityRole="button" onTouchEnd={analyze}>
            {analyzing ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.analyzeText}>Analyze</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.placeholder}>
          <ThemedText style={styles.placeholderIcon}>🧪</ThemedText>
          <ThemedText style={styles.placeholderText}>No photo selected yet.</ThemedText>
        </ThemedView>
      )}

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </ThemedView>
  );
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
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  previewWrap: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  preview: {
    width: '100%',
    height: 260,
    borderRadius: theme.radius.xl,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  analyzeButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeText: {
    color: 'white',
    fontWeight: '700',
  },
  placeholder: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  error: {
    color: theme.colors.danger,
    marginTop: theme.spacing.md,
    fontWeight: '700',
  },
});

