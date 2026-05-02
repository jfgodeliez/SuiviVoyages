import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'trips',
      columns: [
        { name: 'remote_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number' },
        { name: 'end_date', type: 'number' },
        { name: 'owner_id', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'activities',
      columns: [
        { name: 'remote_id', type: 'string', isOptional: true },
        { name: 'trip_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'documents',
      columns: [
        { name: 'remote_id', type: 'string', isOptional: true },
        { name: 'trip_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'storage_path', type: 'string' },
        { name: 'local_path', type: 'string', isOptional: true },
        { name: 'mime_type', type: 'string' },
        { name: 'size', type: 'number' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
