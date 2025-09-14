import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

import { Audio } from '../modal/AppModal';

enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    { name: 'VoiceRecorder.db', location: 'default' },
    () => {},
    (error: any) => {
      console.error(error);
      throw Error('Could not connect to database');
    },
  );
};

export const createTables = async (db: SQLiteDatabase) => {
  const commentsQuery = `
    CREATE TABLE IF NOT EXISTS Recorder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration TEXT,
    filePath TEXT,
    fileName TEXT,
    createdAt TEXT
    );
  `;
  try {
    await db.executeSql(commentsQuery);
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};

export const geAllRecordsDb = async (db: SQLiteDatabase): Promise<Audio[]> => {
  try {
    const comments: Audio[] = [];
    const results = await db.executeSql('SELECT * FROM Recorder');
    results?.forEach(async result => {
      for (let index = 0; index < result.rows.length; index++) {
        const res = result.rows.item(index);
        comments.push(res);
      }
    });
    return comments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addRecordDb = async (db: SQLiteDatabase, record: Audio) => {
  const insertQuery = `
     INSERT INTO Recorder (fileName, filePath, duration, createdAt)
     VALUES (?, ?, ?, ?);
   `;
  const values = [
    record.fileName,
    record.filePath,
    record.duration,
    record.createdAt,
  ];
  try {
    return db.executeSql(insertQuery, values);
  } catch (error) {
    console.log(error);
    throw Error('Failed to add contact');
  }
};
