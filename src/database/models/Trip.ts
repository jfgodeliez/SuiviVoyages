import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, children } from '@nozbe/watermelondb/decorators';
import type Activity from './Activity';
import type Document from './Document';

export default class Trip extends Model {
  static table = 'trips';
  static associations = {
    activities: { type: 'has_many' as const, foreignKey: 'trip_id' },
    documents: { type: 'has_many' as const, foreignKey: 'trip_id' },
  };

  @text('remote_id') remoteId!: string | null;
  @text('title') title!: string;
  @text('description') description!: string | null;
  @date('start_date') startDate!: Date;
  @date('end_date') endDate!: Date;
  @text('owner_id') ownerId!: string;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('activities') activities!: Activity[];
  @children('documents') documents!: Document[];
}
