import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, relation } from '@nozbe/watermelondb/decorators';
import type Trip from './Trip';

export type ActivityType = 'visite' | 'attraction' | 'repas' | 'rendez_vous' | 'autre';

export default class Activity extends Model {
  static table = 'activities';
  static associations = {
    trips: { type: 'belongs_to' as const, key: 'trip_id' },
  };

  @text('remote_id') remoteId!: string | null;
  @text('trip_id') tripId!: string;
  @text('title') title!: string;
  @text('type') type!: ActivityType;
  @date('date') date!: Date;
  @text('location') location!: string | null;
  @text('notes') notes!: string | null;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('trips', 'trip_id') trip!: Trip;
}
