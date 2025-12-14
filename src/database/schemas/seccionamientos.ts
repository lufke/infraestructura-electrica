
import { TableSchema } from "../builder";

export const SeccionamientoSchema: TableSchema = {
    tableName: 'seccionamientos',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        tipo: { type: 'TEXT' },
        nivel_tension: { type: 'TEXT', check: "IN ('BT','MT')" },
        fases: { type: 'INTEGER' },
        corriente: { type: 'REAL' },
        posicion: { type: 'TEXT', check: "IN ('ABIERTO','CERRADO')" },
        condicion: { type: 'TEXT', check: "IN ('BUENO','REGULAR','MALO')", default: 'BUENO' },
        letrero: { type: 'TEXT' },
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
