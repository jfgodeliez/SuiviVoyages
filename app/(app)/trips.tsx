import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../../src/hooks/useTrips';
import { useAuth } from '../../src/contexts/AuthContext';
import { TripCard } from '../../src/components/TripCard';
import type { Trip } from '../../src/types/trip';

export default function TripsScreen() {
  const { trips, isLoading, error, refresh, remove } = useTrips();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = (trip: Trip) => {
    Alert.alert(
      'Supprimer le voyage',
      `Supprimer « ${trip.title} » ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => remove(trip.id),
        },
      ]
    );
  };

  if (isLoading && trips.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Voyages</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(app)/trip/create')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            isOwner={item.ownerId === user?.id}
            onPress={() => router.push(`/(app)/trip/${item.id}`)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="airplane-outline" size={64} color="#ddd" />
            <Text style={styles.emptyTitle}>Aucun voyage</Text>
            <Text style={styles.emptySubtitle}>
              Planifiez votre premier voyage en appuyant sur +
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#111' },
  addButton: {
    backgroundColor: '#1a73e8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: { padding: 16 },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd0d0',
  },
  errorText: { color: '#e53e3e', fontSize: 13, flex: 1 },
  retryText: { color: '#1a73e8', fontWeight: '600', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#aaa', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#bbb', marginTop: 6, textAlign: 'center' },
});
