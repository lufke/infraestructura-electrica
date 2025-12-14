import { SQLiteDatabase } from 'expo-sqlite';
import { createTableBuilder } from './builder';
import { schema } from './schema';
import { PosteSchema } from './schemas/postes';

export const sqlInit = async (db: SQLiteDatabase) => {
    console.log('Inicializando base de datos...');

    // 1. Run legacy/static schema (creates all tables EXCEPT postes)
    await db.execAsync(schema); // Note: schema string no longer has 'postes' creation

    // 2. Run builder for postes
    await createTableBuilder(db, PosteSchema);

    console.log('Base de datos lista.');
};