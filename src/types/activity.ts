export type ActivityType = 'visite' | 'attraction' | 'repas' | 'rendez_vous' | 'autre';

export interface Activity {
  id: string;
  tripId: string;
  title: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM
  location: string | null;
  notes: string | null;
  sortOrder: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  title: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  time?: string | null;
  location?: string | null;
  notes?: string | null;
  sortOrder?: number;
}

export type UpdateActivityInput = Partial<CreateActivityInput>;

export interface ActivitiesByDay {
  date: string; // YYYY-MM-DD
  activities: Activity[];
}
