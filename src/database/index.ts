import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import Trip from './models/Trip';
import Activity from './models/Activity';
import Document from './models/Document';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'suiviVoyages',
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Trip, Activity, Document],
});
