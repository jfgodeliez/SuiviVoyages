import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTripById, updateTrip } from '../../../../src/services/tripService';
import { TripForm } from '../../../../src/components/TripForm';
import type { TripFormValues } from '../../../../src/utils/tripValidators';
import type { TripWithParticipants } from '../../../../src/types/trip';

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => Alert.alert('Erreur', 'Voyage introuvable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (values: TripFormValues) => {
    setSaving(true);
    try {
      await updateTrip(id!, {
        title: values.title.trim(),
        description: values.description.trim() || null,
        startDate: values.startDate!.toISOString(),
        endDate: values.endDate!.toISOString(),
      });
      router.back();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Impossible de modifier le voyage.'
      );
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le voyage</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {trip && (
          <TripForm
            initialValues={{
              title: trip.title,
              description: trip.description ?? '',
              startDate: new Date(trip.startDate),
              endDate: new Date(trip.endDate),
            }}
            onSubmit={handleSubmit}
            submitLabel="Enregistrer les modifications"
            loading={saving}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
