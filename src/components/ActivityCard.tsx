import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TypeBadge } from './TypeBadge';
import type { Activity } from '../types/activity';

interface Props {
  activity: Activity;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActivityCard({ activity, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{activity.time ? activity.time.slice(0, 5) : '--:--'}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {activity.title}
          </Text>
          <TypeBadge type={activity.type} />
        </View>
        {activity.location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#888" />
            <Text style={styles.location} numberOfLines={1}>
              {activity.location}
            </Text>
          </View>
        ) : null}
        {activity.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {activity.notes}
          </Text>
        ) : null}
      </View>
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Ionicons name="pencil-outline" size={16} color="#666" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={16} color="#e53e3e" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  timeCol: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    marginRight: 10,
  },
  time: { fontSize: 12, fontWeight: '700', color: '#1a73e8' },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  title: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  location: { fontSize: 12, color: '#777', flex: 1 },
  notes: { fontSize: 12, color: '#999', lineHeight: 16 },
  actions: { flexDirection: 'column', gap: 6, justifyContent: 'center', paddingLeft: 6 },
  actionBtn: { padding: 4 },
});
