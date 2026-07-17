import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Modal route kept for now, but not used in routing (Step 1).
export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Modal</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

