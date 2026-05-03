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
import { ActivityForm } from '../../../../../../src/components/ActivityForm';
import { useActivities } from '../../../../../../src/hooks/useActivities';
import { getTripById } from '../../../../../../src/services/tripService';
import type { ActivityFormValues } from '../../../../../../src/utils/activityValidators';
import type { TripWithParticipants } from '../../../../../../src/types/trip';
import type { Activity } from '../../../../../../src/types/activity';

export default function EditActivityScreen() {
  const { id, activityId } = useLocalSearchParams<{ id: string; activityId: string }>();
  const { activities, update } = useActivities(id!);
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => Alert.alert('Erreur', 'Voyage introuvable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (activityId && activities.length > 0) {
      const found = activities.find((a) => a.id === activityId) ?? null;
      setActivity(found);
    }
  }, [activityId, activities]);

  const handleSubmit = async (values: ActivityFormValues) => {
    if (!activityId) return;
    setSaving(true);
    try {
      await update(activityId, {
        title: values.title.trim(),
        type: values.type!,
        date: values.date!.toISOString().split('T')[0],
        time: values.time.trim() || null,
        location: values.location.trim() || null,
        notes: values.notes.trim() || null,
      });
      router.back();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : "Impossible de modifier l'activité."
      );
      setSaving(false);
    }
  };

  if (isLoading || !trip) {
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
        <Text style={styles.title}>Modifier l'activité</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {activity && (
          <ActivityForm
            initialValues={{
              title: activity.title,
              type: activity.type,
              date: new Date(activity.date + 'T00:00:00'),
              time: activity.time ?? '',
              location: activity.location ?? '',
              notes: activity.notes ?? '',
            }}
            tripStart={new Date(trip.startDate + 'T00:00:00')}
            tripEnd={new Date(trip.endDate + 'T00:00:00')}
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
