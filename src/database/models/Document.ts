import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, relation } from '@nozbe/watermelondb/decorators';
import type Trip from './Trip';

export type DocumentCategory = 'passeport' | 'billet' | 'reservation' | 'autre';

export default class Document extends Model {
  static table = 'documents';
  static associations = {
    trips: { type: 'belongs_to' as const, key: 'trip_id' },
  };

  @text('remote_id') remoteId!: string | null;
  @text('trip_id') tripId!: string;
  @text('name') name!: string;
  @text('category') category!: DocumentCategory;
  @text('storage_path') storagePath!: string;
  @text('local_path') localPath!: string | null;
  @text('mime_type') mimeType!: string;
  @field('size') size!: number;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('trips', 'trip_id') trip!: Trip;
}
