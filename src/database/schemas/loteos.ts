
import { TableSchema } from "../builder";

export const LoteoSchema: TableSchema = {
    tableName: 'loteos',
    columns: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        nombre: { type: 'TEXT', notNull: true },
        direccion: { type: 'TEXT' },
        propietario: { type: 'TEXT' },
        id_owner: { type: 'TEXT' },
        telefono: { type: 'TEXT' },
        correo: { type: 'TEXT' },
        comuna: { type: 'TEXT' },
        distribuidora: { type: 'TEXT' },
        n_cliente: { type: 'TEXT' },
        tension_mt: { type: 'REAL' },
        tension_bt: { type: 'REAL' },
        nivel_tension: { type: 'TEXT', check: "IN ('BT','MT')" },
        latitud: { type: 'REAL' },
        longitud: { type: 'REAL' },
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
