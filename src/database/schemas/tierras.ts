
import { TableSchema } from "../builder";

export const TierraSchema: TableSchema = {
    tableName: 'tierras',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        tipo: { type: 'TEXT', check: "IN ('TP','TS')" },
        resistencia: { type: 'REAL' },
        condicion: { type: 'TEXT', check: "IN ('BUENO','REGULAR','MALO')", default: 'BUENO' },
        notas: { type: 'TEXT' },
        id_soporte: { type: 'INTEGER', notNull: true, references: { table: 'soportes', column: 'id', onDelete: 'CASCADE' } },
        synced: { type: 'INTEGER', default: 0 },
        id_supabase: { type: 'INTEGER' },
        created_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        updated_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        deleted: { type: 'INTEGER', default: 0 },
        created_by: { type: 'TEXT' },
        updated_by: { type: 'TEXT' }
    }
};
