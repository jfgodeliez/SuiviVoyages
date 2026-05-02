import { supabase } from './supabase';
import type { Trip, CreateTripInput, UpdateTripInput, TripWithParticipants } from '../types/trip';

export async function getTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .or(`owner_id.eq.${userId},trip_participants.user_id.eq.${userId}`)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTrip);
}

export async function getTripById(tripId: string): Promise<TripWithParticipants> {
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_participants(*)')
    .eq('id', tripId)
    .single();
  if (error) throw error;
  return {
    ...mapTrip(data),
    participants: (data.trip_participants ?? []).map(
      (p: { trip_id: string; user_id: string; role: string; joined_at: string }) => ({
        tripId: p.trip_id,
        userId: p.user_id,
        role: p.role as 'admin' | 'member',
        joinedAt: p.joined_at,
      })
    ),
  };
}

export async function createTrip(userId: string, input: CreateTripInput): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      title: input.title,
      description: input.description,
      start_date: input.startDate,
      end_date: input.endDate,
      owner_id: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTrip(data);
}

export async function updateTrip(tripId: string, input: UpdateTripInput): Promise<Trip> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.startDate !== undefined) patch.start_date = input.startDate;
  if (input.endDate !== undefined) patch.end_date = input.endDate;

  const { data, error } = await supabase
    .from('trips')
    .update(patch)
    .eq('id', tripId)
    .select()
    .single();
  if (error) throw error;
  return mapTrip(data);
}

export async function deleteTrip(tripId: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', tripId);
  if (error) throw error;
}

export async function inviteParticipant(tripId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('trip_participants')
    .insert({ trip_id: tripId, user_id: userId, role: 'member' });
  if (error) throw error;
}

export async function removeParticipant(tripId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('trip_participants')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', userId);
  if (error) throw error;
}

function mapTrip(raw: Record<string, unknown>): Trip {
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string | null,
    startDate: raw.start_date as string,
    endDate: raw.end_date as string,
    ownerId: raw.owner_id as string,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}
