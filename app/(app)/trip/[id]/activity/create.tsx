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
import { ActivityForm } from '../../../../../src/components/ActivityForm';
import { useActivities } from '../../../../../src/hooks/useActivities';
import { getTripById } from '../../../../../src/services/tripService';
import type { ActivityFormValues } from '../../../../../src/utils/activityValidators';
import type { TripWithParticipants } from '../../../../../src/types/trip';

export default function CreateActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { create } = useActivities(id!);
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => Alert.alert('Erreur', 'Voyage introuvable.'))
      .finally(() => setLoadingTrip(false));
  }, [id]);

  const handleSubmit = async (values: ActivityFormValues) => {
    if (!id) return;
    setSaving(true);
    try {
      await create(id, {
        title: values.title.trim(),
        type: values.type!,
        date: values.date!.toISOString().split('T')[0],
        time: values.time.trim() || null,
        location: values.location.trim() || null,
        notes: values.notes.trim() || null,
      });
      router.back();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible de créer l'activité.");
      setSaving(false);
    }
  };

  if (loadingTrip || !trip) {
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
        <Text style={styles.title}>Nouvelle activité</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ActivityForm
          tripStart={new Date(trip.startDate + 'T00:00:00')}
          tripEnd={new Date(trip.endDate + 'T00:00:00')}
          onSubmit={handleSubmit}
          submitLabel="Créer l'activité"
          loading={saving}
        />
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
