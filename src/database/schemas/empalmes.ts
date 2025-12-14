
import { TableSchema } from "../builder";

export const EmpalmeSchema: TableSchema = {
    tableName: 'empalmes',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        n_medidor: { type: 'TEXT' },
        nivel_tension: { type: 'TEXT', check: "IN ('BT','MT')" },
        fases: { type: 'INTEGER' },
        capacidad: { type: 'REAL' },
        direccion: { type: 'TEXT' },
        parcela: { type: 'TEXT' },
        activo: { type: 'INTEGER', check: "IN (0,1)", default: 1 },
        id_soporte: { type: 'INTEGER', notNull: true, references: { table: 'soportes', column: 'id', onDelete: 'CASCADE' } },
        id_subestacion: { type: 'INTEGER', references: { table: 'subestaciones', column: 'id', onDelete: 'CASCADE' } },
        notas: { type: 'TEXT' },
        synced: { type: 'INTEGER', default: 0 },
        id_supabase: { type: 'INTEGER' },
        created_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        updated_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
        deleted: { type: 'INTEGER', default: 0 },
        created_by: { type: 'TEXT' },
        updated_by: { type: 'TEXT' }
    }
};
