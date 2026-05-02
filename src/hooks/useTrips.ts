import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../services/tripService';
import type { Trip, CreateTripInput, UpdateTripInput } from '../types/trip';

interface UseTripsResult {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateTripInput) => Promise<Trip>;
  update: (id: string, input: UpdateTripInput) => Promise<Trip>;
  remove: (id: string) => Promise<void>;
}

export function useTrips(): UseTripsResult {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTrips(user.id);
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateTripInput) => {
      if (!user) throw new Error('Non authentifié.');
      const trip = await createTrip(user.id, input);
      setTrips((prev) => [...prev, trip].sort((a, b) => a.startDate.localeCompare(b.startDate)));
      return trip;
    },
    [user]
  );

  const update = useCallback(async (id: string, input: UpdateTripInput) => {
    const updated = await updateTrip(id, input);
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { trips, isLoading, error, refresh, create, update, remove };
}
