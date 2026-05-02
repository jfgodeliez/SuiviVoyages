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
import { getTripById, deleteTrip } from '../../../src/services/tripService';
import { useAuth } from '../../../src/contexts/AuthContext';
import { formatDateRange, daysBetween } from '../../../src/utils/date';
import type { TripWithParticipants } from '../../../src/types/trip';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => Alert.alert('Erreur', 'Voyage introuvable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const isOwner = trip?.ownerId === user?.id;

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le voyage',
      `Supprimer « ${trip?.title} » ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(id!);
              router.replace('/(app)/trips');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer le voyage.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!trip) return null;

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = daysBetween(start, end) + 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {trip.title}
        </Text>
        {isOwner && (
          <TouchableOpacity
            onPress={() => router.push(`/(app)/trip/${id}/edit`)}
            style={styles.editBtn}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Ionicons name="airplane" size={40} color="#1a73e8" />
          <Text style={styles.heroTitle}>{trip.title}</Text>
          <Text style={styles.heroDates}>{formatDateRange(start, end)}</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {days} jour{days > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {trip.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{trip.description}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants ({trip.participants.length + 1})</Text>
          <View style={styles.participantRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>P</Text>
            </View>
            <Text style={styles.participantName}>Propriétaire</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Admin</Text>
            </View>
          </View>
          {trip.participants.map((p) => (
            <View key={p.userId} style={styles.participantRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.userId[0].toUpperCase()}</Text>
              </View>
              <Text style={styles.participantName}>{p.userId}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{p.role === 'admin' ? 'Admin' : 'Membre'}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.activitiesBtn}
            onPress={() => router.push(`/(app)/trip/${id}/activities`)}
          >
            <Ionicons name="calendar-outline" size={20} color="#1a73e8" />
            <Text style={styles.activitiesBtnText}>Voir les activités</Text>
            <Ionicons name="chevron-forward" size={18} color="#1a73e8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentsBtn}
            onPress={() => router.push(`/(app)/trip/${id}/documents`)}
          >
            <Ionicons name="document-outline" size={20} color="#1a73e8" />
            <Text style={styles.activitiesBtnText}>Documents</Text>
            <Ionicons name="chevron-forward" size={18} color="#1a73e8" />
          </TouchableOpacity>
        </View>

        {isOwner && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#e53e3e" />
            <Text style={styles.deleteBtnText}>Supprimer ce voyage</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#1a73e8',
  },
  backBtn: { padding: 6 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#fff', marginHorizontal: 8 },
  editBtn: { padding: 6 },
  content: { padding: 16 },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginTop: 12, textAlign: 'center' },
  heroDates: { fontSize: 14, color: '#666', marginTop: 4 },
  heroBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  heroBadgeText: { color: '#1a73e8', fontWeight: '700' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 10 },
  sectionContent: { fontSize: 14, color: '#555', lineHeight: 20 },
  participantRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  participantName: { flex: 1, fontSize: 14, color: '#333' },
  roleBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleBadgeText: { fontSize: 11, color: '#1a73e8', fontWeight: '600' },
  actionsSection: { marginBottom: 12 },
  activitiesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  documentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activitiesBtnText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '600', marginLeft: 10 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e53e3e',
    marginTop: 8,
    gap: 6,
  },
  deleteBtnText: { color: '#e53e3e', fontWeight: '700', fontSize: 15 },
});
