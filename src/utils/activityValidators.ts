import type { ActivityType } from '../types/activity';

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'visite', label: 'Visite' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'repas', label: 'Repas' },
  { value: 'rendez_vous', label: 'Rendez-vous' },
  { value: 'autre', label: 'Autre' },
];

export interface ActivityFormValues {
  title: string;
  type: ActivityType | null;
  date: Date | null;
  time: string; // HH:MM or ''
  location: string;
  notes: string;
}

export interface ActivityFormErrors {
  title?: string;
  type?: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
}

export function validateActivityForm(
  values: ActivityFormValues,
  tripStart?: Date,
  tripEnd?: Date
): ActivityFormErrors {
  const errors: ActivityFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Le titre est requis.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères.';
  }

  if (!values.type) {
    errors.type = 'Le type est requis.';
  }

  if (!values.date) {
    errors.date = 'La date est requise.';
  } else if (tripStart && tripEnd) {
    const d = new Date(values.date);
    d.setHours(12, 0, 0, 0);
    const s = new Date(tripStart);
    s.setHours(0, 0, 0, 0);
    const e = new Date(tripEnd);
    e.setHours(23, 59, 59, 999);
    if (d < s || d > e) {
      errors.date = 'La date doit être dans la période du voyage.';
    }
  }

  if (values.time && !/^\d{2}:\d{2}$/.test(values.time)) {
    errors.time = 'Format HH:MM requis (ex : 09:30).';
  }

  if (values.location.length > 200) {
    errors.location = 'Le lieu ne peut pas dépasser 200 caractères.';
  }

  if (values.notes.length > 1000) {
    errors.notes = 'Les notes ne peuvent pas dépasser 1000 caractères.';
  }

  return errors;
}

export function isActivityFormValid(
  values: ActivityFormValues,
  tripStart?: Date,
  tripEnd?: Date
): boolean {
  return Object.keys(validateActivityForm(values, tripStart, tripEnd)).length === 0;
}
