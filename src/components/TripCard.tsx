import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateRange, daysBetween } from '../utils/date';
import type { Trip } from '../types/trip';

interface Props {
  trip: Trip;
  onPress: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

export function TripCard({ trip, onPress, onDelete, isOwner }: Props) {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = daysBetween(start, end);
  const isPast = end < new Date();
  const isOngoing = start <= new Date() && end >= new Date();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="airplane" size={18} color="#1a73e8" style={styles.icon} />
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
        </View>
        {isOwner && onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color="#e53e3e" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.dates}>{formatDateRange(start, end)}</Text>

      <View style={styles.footer}>
        <View style={[styles.badge, isPast && styles.badgePast, isOngoing && styles.badgeOngoing]}>
          <Text
            style={[
              styles.badgeText,
              isPast && styles.badgeTextPast,
              isOngoing && styles.badgeTextOngoing,
            ]}
          >
            {isOngoing ? 'En cours' : isPast ? 'Terminé' : 'À venir'}
          </Text>
        </View>
        <Text style={styles.duration}>{days === 0 ? '1 jour' : `${days + 1} jours`}</Text>
      </View>

      {trip.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {trip.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  icon: { marginRight: 6 },
  title: { fontSize: 17, fontWeight: '700', color: '#111', flex: 1 },
  dates: { fontSize: 13, color: '#666', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgePast: { backgroundColor: '#f0f0f0' },
  badgeOngoing: { backgroundColor: '#e6f4ea' },
  badgeText: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },
  badgeTextPast: { color: '#888' },
  badgeTextOngoing: { color: '#34a853' },
  duration: { fontSize: 13, color: '#888' },
  description: { fontSize: 13, color: '#777', marginTop: 8, lineHeight: 18 },
});
