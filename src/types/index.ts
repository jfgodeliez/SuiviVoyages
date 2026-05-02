export type UserRole = 'admin' | 'member';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface TripParticipant {
  userId: string;
  tripId: string;
  role: UserRole;
  joinedAt: string;
}

export type { ActivityType } from '../database/models/Activity';
export type { DocumentCategory } from '../database/models/Document';
