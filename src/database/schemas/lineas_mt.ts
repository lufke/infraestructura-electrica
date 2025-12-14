
import { TableSchema } from "../builder";

export const LineaMTSchema: TableSchema = {
    tableName: 'lineas_mt',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        material: { type: 'TEXT', check: "IN ('ALUMINIO','COBRE')" },
        aislacion: { type: 'TEXT', check: "IN ('DESNUDO','AISLADO')" },
        tipo: { type: 'TEXT' },
        fases: { type: 'INTEGER' },
        seccion: { type: 'REAL' },
        largo: { type: 'REAL' },
        condicion: { type: 'TEXT', check: "IN ('BUENO','REGULAR','MALO')", default: 'BUENO' },
        id_soporte_inicio: { type: 'INTEGER', notNull: true, references: { table: 'soportes', column: 'id', onDelete: 'CASCADE' } },
        id_soporte_final: { type: 'INTEGER', notNull: true, references: { table: 'soportes', column: 'id', onDelete: 'CASCADE' } },
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
