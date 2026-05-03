import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function formatDayHeader(dateStr: string): { weekday: string; date: string; dayNum: number } {
  // Parse as local date to avoid UTC shift
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateFormatted = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date: dateFormatted,
    dayNum: d,
  };
}

interface Props {
  dateStr: string; // YYYY-MM-DD
  tripStartStr: string; // YYYY-MM-DD — used to compute day index
  count: number;
}

export function DaySection({ dateStr, tripStartStr, count }: Props) {
  const [sy, sm, sd] = tripStartStr.split('-').map(Number);
  const [dy, dm, dd] = dateStr.split('-').map(Number);
  const startMs = new Date(sy, sm - 1, sd).getTime();
  const dayMs = new Date(dy, dm - 1, dd).getTime();
  const dayIndex = Math.round((dayMs - startMs) / 86400000) + 1;

  const { weekday, date } = formatDayHeader(dateStr);

  return (
    <View style={styles.header}>
      <View style={styles.dayBadge}>
        <Text style={styles.dayNum}>J{dayIndex}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.weekday}>{weekday}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {count} activité{count > 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 4,
    gap: 10,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNum: { color: '#fff', fontWeight: '800', fontSize: 12 },
  info: { flex: 1 },
  weekday: { fontSize: 15, fontWeight: '700', color: '#111' },
  date: { fontSize: 12, color: '#666' },
  countBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: { fontSize: 11, color: '#1a73e8', fontWeight: '600' },
});
