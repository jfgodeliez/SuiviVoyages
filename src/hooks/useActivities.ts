import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../services/activityService';
import type {
  Activity,
  ActivitiesByDay,
  CreateActivityInput,
  UpdateActivityInput,
} from '../types/activity';

function groupByDay(activities: Activity[]): ActivitiesByDay[] {
  const map = new Map<string, Activity[]>();
  for (const a of activities) {
    if (!map.has(a.date)) map.set(a.date, []);
    map.get(a.date)!.push(a);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, acts]) => ({
      date,
      activities: acts.sort(
        (x, y) => x.sortOrder - y.sortOrder || (x.time ?? '').localeCompare(y.time ?? '')
      ),
    }));
}

interface UseActivitiesResult {
  activities: Activity[];
  byDay: ActivitiesByDay[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (tripId: string, input: CreateActivityInput) => Promise<Activity>;
  update: (id: string, input: UpdateActivityInput) => Promise<Activity>;
  remove: (id: string) => Promise<void>;
}

export function useActivities(tripId: string): UseActivitiesResult {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getActivities(tripId);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement.');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (tid: string, input: CreateActivityInput) => {
      if (!user) throw new Error('Non authentifié.');
      const activity = await createActivity(tid, user.id, input);
      setActivities((prev) =>
        [...prev, activity].sort(
          (a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? '')
        )
      );
      return activity;
    },
    [user]
  );

  const update = useCallback(async (id: string, input: UpdateActivityInput) => {
    const updated = await updateActivity(id, input);
    setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    activities,
    byDay: groupByDay(activities),
    isLoading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}
