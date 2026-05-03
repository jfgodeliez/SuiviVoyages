import { supabase } from './supabase';
import type { Activity, CreateActivityInput, UpdateActivityInput } from '../types/activity';

export async function getActivities(tripId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('trip_id', tripId)
    .order('date', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapActivity);
}

export async function createActivity(
  tripId: string,
  userId: string,
  input: CreateActivityInput
): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      trip_id: tripId,
      title: input.title,
      type: input.type,
      date: input.date,
      time: input.time ?? null,
      location: input.location ?? null,
      notes: input.notes ?? null,
      sort_order: input.sortOrder ?? 0,
      created_by: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return mapActivity(data);
}

export async function updateActivity(
  activityId: string,
  input: UpdateActivityInput
): Promise<Activity> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.type !== undefined) patch.type = input.type;
  if (input.date !== undefined) patch.date = input.date;
  if (input.time !== undefined) patch.time = input.time ?? null;
  if (input.location !== undefined) patch.location = input.location ?? null;
  if (input.notes !== undefined) patch.notes = input.notes ?? null;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from('activities')
    .update(patch)
    .eq('id', activityId)
    .select()
    .single();
  if (error) throw error;
  return mapActivity(data);
}

export async function deleteActivity(activityId: string): Promise<void> {
  const { error } = await supabase.from('activities').delete().eq('id', activityId);
  if (error) throw error;
}

function mapActivity(raw: Record<string, unknown>): Activity {
  return {
    id: raw.id as string,
    tripId: raw.trip_id as string,
    title: raw.title as string,
    type: raw.type as Activity['type'],
    date: raw.date as string,
    time: raw.time as string | null,
    location: raw.location as string | null,
    notes: raw.notes as string | null,
    sortOrder: raw.sort_order as number,
    createdBy: raw.created_by as string,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}
