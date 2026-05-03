import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TripForm } from '../../../src/components/TripForm';
import { useTrips } from '../../../src/hooks/useTrips';
import type { TripFormValues } from '../../../src/utils/tripValidators';

export default function CreateTripScreen() {
  const { create } = useTrips();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: TripFormValues) => {
    setLoading(true);
    try {
      const trip = await create({
        title: values.title.trim(),
        description: values.description.trim() || null,
        startDate: values.startDate!.toISOString().split('T')[0],
        endDate: values.endDate!.toISOString().split('T')[0],
      });
      router.replace(`/(app)/trip/${trip.id}`);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de créer le voyage.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau voyage</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TripForm onSubmit={handleSubmit} submitLabel="Créer le voyage" loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { padding: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#111' },
  content: { padding: 20 },
});
