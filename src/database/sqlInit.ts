import { SQLiteDatabase } from 'expo-sqlite';
import { schema } from './schema';

export const sqlInit = async (db: SQLiteDatabase) => {
    console.log('Inicializando base de datos...');
    await db.execAsync(schema);
    console.log('Base de datos lista.');
};