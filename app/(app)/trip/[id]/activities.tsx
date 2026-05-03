import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useActivities } from '../../../../src/hooks/useActivities';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { ActivityCard } from '../../../../src/components/ActivityCard';
import { DaySection } from '../../../../src/components/DaySection';
import { TYPE_CONFIG } from '../../../../src/components/TypeBadge';
import { getTripById } from '../../../../src/services/tripService';
import type { TripWithParticipants } from '../../../../src/types/trip';
import type { ActivityType } from '../../../../src/types/activity';

const ALL_TYPES = Object.keys(TYPE_CONFIG) as ActivityType[];

export default function ActivitiesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { byDay, isLoading, error, remove } = useActivities(id!);
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [filter, setFilter] = useState<ActivityType | null>(null);

  useEffect(() => {
    if (id)
      getTripById(id)
        .then(setTrip)
        .catch(() => null);
  }, [id]);

  const handleDelete = (activityId: string, title: string) => {
    Alert.alert('Supprimer', `Supprimer « ${title} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () =>
          remove(activityId).catch(() => Alert.alert('Erreur', 'Suppression échouée.')),
      },
    ]);
  };

  const filteredByDay = byDay
    .map((day) => ({
      ...day,
      activities: filter ? day.activities.filter((a) => a.type === filter) : day.activities,
    }))
    .filter((day) => day.activities.length > 0);

  const totalCount = byDay.reduce((sum, d) => sum + d.activities.length, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Activités
          </Text>
          {trip && (
            <Text style={styles.headerSub} numberOfLines={1}>
              {trip.title}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push(`/(app)/trip/${id}/activity/create`)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filterScroll} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterChip, !filter && styles.filterChipActive]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterText, !filter && styles.filterTextActive]}>
              Tout ({totalCount})
            </Text>
          </TouchableOpacity>
          {ALL_TYPES.map((type) => {
            const cfg = TYPE_CONFIG[type];
            const count = byDay.reduce(
              (s, d) => s + d.activities.filter((a) => a.type === type).length,
              0
            );
            if (count === 0) return null;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  filter === type && { backgroundColor: cfg.bg, borderColor: cfg.color },
                ]}
                onPress={() => setFilter(filter === type ? null : type)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === type && { color: cfg.color, fontWeight: '700' },
                  ]}
                >
                  {cfg.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredByDay.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={56} color="#ccc" />
          <Text style={styles.emptyTitle}>Aucune activité</Text>
          <Text style={styles.emptyText}>
            {filter ? 'Aucune activité pour ce filtre.' : 'Ajoutez votre première activité !'}
          </Text>
          {!filter && (
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push(`/(app)/trip/${id}/activity/create`)}
            >
              <Text style={styles.emptyBtnText}>Ajouter une activité</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {filteredByDay.map((day) => (
            <View key={day.date}>
              <DaySection
                dateStr={day.date}
                tripStartStr={trip?.startDate ?? day.date}
                count={day.activities.length}
              />
              {day.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={() => router.push(`/(app)/trip/${id}/activity/${activity.id}/edit`)}
                  onDelete={
                    activity.createdBy === user?.id || trip?.ownerId === user?.id
                      ? () => handleDelete(activity.id, activity.title)
                      : undefined
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: '#1a73e8',
    gap: 10,
  },
  backBtn: { padding: 6 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  addBtn: { padding: 6 },
  filterScroll: {
    maxHeight: 52,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filters: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: '#e8f0fe', borderColor: '#1a73e8' },
  filterText: { fontSize: 13, color: '#555' },
  filterTextActive: { color: '#1a73e8', fontWeight: '700' },
  content: { padding: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#e53e3e', fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  emptyBtn: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
