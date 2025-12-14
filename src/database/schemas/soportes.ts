
import { TableSchema } from "../builder";

export const SoporteSchema: TableSchema = {
    tableName: 'soportes',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        tipo: { type: 'TEXT', check: "IN ('POSTE','CAMARA')" },
        latitud: { type: 'REAL' },
        longitud: { type: 'REAL' },
        altitud: { type: 'REAL' },
        precision: { type: 'REAL' },
        notas: { type: 'TEXT' },
        id_loteo: { type: 'INTEGER', notNull: true, references: { table: 'loteos', column: 'id', onDelete: 'CASCADE' } },
        synced: { type: 'INTEGER', default: 0 },
        id_supabase: { type: 'INTEGER' },
        created_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        updated_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        deleted: { type: 'INTEGER', default: 0 },
        created_by: { type: 'TEXT' },
        updated_by: { type: 'TEXT' }
    }
};
