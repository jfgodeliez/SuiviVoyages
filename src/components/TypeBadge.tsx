import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ActivityType } from '../types/activity';

export const TYPE_CONFIG: Record<ActivityType, { label: string; color: string; bg: string }> = {
  visite: { label: 'Visite', color: '#1a73e8', bg: '#e8f0fe' },
  attraction: { label: 'Attraction', color: '#e65100', bg: '#fff3e0' },
  repas: { label: 'Repas', color: '#2e7d32', bg: '#e8f5e9' },
  rendez_vous: { label: 'Rendez-vous', color: '#6a1b9a', bg: '#f3e5f5' },
  autre: { label: 'Autre', color: '#616161', bg: '#f5f5f5' },
};

export function TypeBadge({ type }: { type: ActivityType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600' },
});
