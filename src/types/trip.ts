export interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripParticipant {
  tripId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface TripWithParticipants extends Trip {
  participants: TripParticipant[];
}

export type CreateTripInput = Pick<Trip, 'title' | 'description' | 'startDate' | 'endDate'>;
export type UpdateTripInput = Partial<CreateTripInput>;
