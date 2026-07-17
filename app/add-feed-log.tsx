import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useData } from '@/context/DataContext';
import type { Pond } from '@/data/mockPonds';

// Add a feed log entry. (Step 6)
export default function AddFeedLogScreen() {
  const router = useRouter();
  const { ponds, addFeedLog } = useData();

  const [pondId, setPondId] = useState<string>(ponds[0]?.id ?? '');
  const [amountKg, setAmountKg] = useState<string>('');
  const [timeIso, setTimeIso] = useState<string>(new Date().toISOString());

  const selectedPond: Pond | undefined = useMemo(
    () => ponds.find((p) => p.id === pondId),
    [pondId, ponds]
  );

  const amount = Number(amountKg);
  const parsedAmountOk = Number.isFinite(amount) && amount > 0;

  const onSubmit = () => {
    if (!pondId) return;
    if (!parsedAmountOk) return;

    addFeedLog({
      pondId,
      amount,
      time: timeIso || new Date().toISOString(),
    });

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Add Feed Log
      </ThemedText>

      <ThemedText style={styles.label}>Pond</ThemedText>
      <ThemedView style={styles.pillRow}>
        {ponds.map((p) => {
          const active = p.id === pondId;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.pill, active ? styles.pillActive : null]}
              onPress={() => setPondId(p.id)}
              accessibilityRole="button">
              <ThemedText style={active ? styles.pillTextActive : styles.pillText}>
                {p.name.split(' ')[0]}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ThemedView>

      <ThemedText style={styles.label}>Amount (kg)</ThemedText>
      <ThemedView style={styles.inputWrap}>
        <ThemedText style={styles.inlineHint}>
          {amountKg || 'Enter kg (e.g. 12.5)'}
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.muted}>
        Note: For this scaffold version, amount is set via preset buttons.
      </ThemedText>

      <ThemedView style={styles.presetRow}>
        {[8, 10, 12.5, 15].map((v) => (
          <TouchableOpacity
            key={v}
            style={styles.preset}
            onPress={() => setAmountKg(String(v))}
            accessibilityRole="button">
            <ThemedText style={styles.presetText}>{v} kg</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedText style={styles.muted}>Time: {new Date(timeIso).toLocaleString()}</ThemedText>

      <TouchableOpacity
        style={[styles.submit, !parsedAmountOk ? { opacity: 0.6 } : null]}
        accessibilityRole="button"
        onPress={onSubmit}>
        <ThemedText style={styles.submitText}>Save</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.preview}>
        {selectedPond ? `Saving for ${selectedPond.name}` : ''}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    marginBottom: 6,
  },
  label: {
    fontWeight: '800',
    marginTop: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pillActive: {
    borderColor: 'rgba(47,128,237,0.7)',
    backgroundColor: 'rgba(47,128,237,0.15)',
  },
  pillText: { opacity: 0.9, fontWeight: '800' },
  pillTextActive: { color: '#2F80ED', fontWeight: '900' },
  inputWrap: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  inlineHint: {
    opacity: 0.85,
  },
  muted: {
    opacity: 0.75,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preset: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  presetText: { fontWeight: '900' },
  submit: {
    marginTop: 14,
    backgroundColor: '#2F80ED',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontWeight: '900' },
  preview: {
    opacity: 0.65,
    marginTop: 8,
  },
});

