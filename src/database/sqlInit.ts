import { SQLiteDatabase } from 'expo-sqlite';
import { createTableBuilder } from './builder';
import { schema } from './schema';
import { CamaraSchema } from './schemas/camaras';
import { EmpalmeSchema } from './schemas/empalmes';
import { EstructuraSchema } from './schemas/estructuras';
import { LineaBTSchema } from './schemas/lineas_bt';
import { LineaMTSchema } from './schemas/lineas_mt';
import { LoteoSchema } from './schemas/loteos';
import { LuminariaSchema } from './schemas/luminarias';
import { PosteSchema } from './schemas/postes';
import { SeccionamientoSchema } from './schemas/seccionamientos';
import { SoporteSchema } from './schemas/soportes';
import { SubestacionSchema } from './schemas/subestaciones';
import { TierraSchema } from './schemas/tierras';
import { TiranteSchema } from './schemas/tirantes';

export const sqlInit = async (db: SQLiteDatabase) => {
    console.log('Inicializando base de datos...');

    // 1. Run legacy schema (PRAGMA and others if any left)
    await db.execAsync(schema);

    // 2. Run builders in dependency order
    await createTableBuilder(db, LoteoSchema);
    await createTableBuilder(db, SoporteSchema);

    // Subtypes depend on Soportes
    await createTableBuilder(db, PosteSchema);
    await createTableBuilder(db, CamaraSchema);
    await createTableBuilder(db, EstructuraSchema);
    await createTableBuilder(db, SeccionamientoSchema);
    await createTableBuilder(db, SubestacionSchema);
    await createTableBuilder(db, TiranteSchema);
    await createTableBuilder(db, TierraSchema);

    // Network elements (some depend on Subestaciones like Empalmes/LineasBT)
    await createTableBuilder(db, EmpalmeSchema);
    await createTableBuilder(db, LineaMTSchema);
    await createTableBuilder(db, LineaBTSchema);
    await createTableBuilder(db, LuminariaSchema);

    console.log('Base de datos lista.');
};