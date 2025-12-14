import { SQLiteDatabase } from "expo-sqlite";

// Convierte undefined → null (SQLite no acepta undefined)
export const normalizeValue = (v: any) =>
    v === undefined ? null : v;

export function normalizeParams(obj: Record<string, any>) {
    return Object.values(obj).map(normalizeValue);
}

/**
 * Crea un INSERT dinámico
 */
export async function insertBuilder(
    db: SQLiteDatabase,
    table: string,
    data: Record<string, any>
) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");

    const sql = `
    INSERT INTO ${table} (${keys.join(", ")})
    VALUES (${placeholders})
  `;

    const params = normalizeParams(data);

    return db.runAsync(sql, params);
}

/**
 * Crea un UPDATE dinámico
 */
export async function updateBuilder(
    db: SQLiteDatabase,
    table: string,
    id: number,
    data: Record<string, any>,
    idColumn: string = "id"
) {
    const keys = Object.keys(data);
    const assignments = keys.map(k => `${k} = ?`).join(", ");

    const sql = `
    UPDATE ${table}
    SET ${assignments}, updated_at = CURRENT_TIMESTAMP
    WHERE ${idColumn} = ?
  `;

    const params = [...normalizeParams(data), id];

    return db.runAsync(sql, params);
}

/**
 * Soft delete → set deleted = 1
 */
export async function softDeleteBuilder(
    db: SQLiteDatabase,
    table: string,
    id: number
) {
    const sql = `
    UPDATE ${table}
    SET deleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    return db.runAsync(sql, [id]);
}

/**
 * Hard delete → DELETE FROM table
 */
export async function deleteBuilder(
    db: SQLiteDatabase,
    table: string,
    id: number
) {
    const sql = `
    DELETE FROM ${table}
    WHERE id = ?
  `;

    return db.runAsync(sql, [id]);
}

/**
 * SELECT con filtros dinámicos (WHERE opcional)
 */
export async function selectBuilder(
    db: SQLiteDatabase,
    table: string,
    where?: Record<string, any>
) {
    if (!where) {
        return db.getAllAsync(`SELECT * FROM ${table}`);
    }

    const keys = Object.keys(where);
    const conditions = keys.map(k => `${k} = ?`).join(" AND ");

    const sql = `
    SELECT * FROM ${table}
    WHERE ${conditions}
  `;

    return db.getAllAsync(sql, normalizeParams(where));
}

/**
 * SELECT con JOIN para obtener entidades por id_loteo a través de soportes
 * Ejemplo: obtener postes de un loteo específico
 */
export async function selectWithJoinBuilder(
    db: SQLiteDatabase,
    table: string,
    joinTable: string,
    joinCondition: string,
    where?: Record<string, any>
) {
    let sql = `SELECT ${table}.* FROM ${table} INNER JOIN ${joinTable} ON ${joinCondition}`;
    const values: any[] = [];

    if (where && Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
            values.push(where[key]);
            return `${joinTable}.${key} = ?`;
        });
        sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    return db.getAllAsync(sql, values);
}


/**
 * Schema Definition Types
 */
export interface ColumnDefinition {
    type: 'INTEGER' | 'REAL' | 'TEXT' | 'BLOB';
    primaryKey?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    unique?: boolean;
    check?: string; // e.g. "IN ('A', 'B')"
    default?: string | number;
    references?: {
        table: string;
        column: string;
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    };
}

export interface TableSchema {
    tableName: string;
    columns: Record<string, ColumnDefinition>;
    constraints?: string[]; // Additional constraints like compound keys
}

/**
 * Crea una tabla dinámicamente basada en un esquema
 */
export async function createTableBuilder(
    db: SQLiteDatabase,
    schema: TableSchema
) {
    const columns = Object.entries(schema.columns).map(([name, def]) => {
        let colSql = `${name} ${def.type}`;

        if (def.primaryKey) colSql += " PRIMARY KEY";
        if (def.autoIncrement) colSql += " AUTOINCREMENT";
        if (def.notNull) colSql += " NOT NULL";
        if (def.unique) colSql += " UNIQUE";
        if (def.check) colSql += ` CHECK(${name} ${def.check})`;
        if (def.default !== undefined) {
            const defVal = typeof def.default === 'string' ? `'${def.default}'` : def.default;
            colSql += ` DEFAULT ${defVal}`;
        }
        if (def.references) {
            colSql += ` REFERENCES ${def.references.table}(${def.references.column})`;
            if (def.references.onDelete) {
                colSql += ` ON DELETE ${def.references.onDelete}`;
            }
        }
        return colSql;
    });

    // Add explicit foreign keys if defined at table level (optional, simpler to do inline for now unless circular)
    // For now we assume inline references are enough for simple schemas.

    const fullSql = `
    CREATE TABLE IF NOT EXISTS ${schema.tableName} (
        ${columns.join(",\n        ")}${schema.constraints ? ",\n        " + schema.constraints.join(",\n        ") : ""}
    );
    `;

    console.log(`Creating table ${schema.tableName}...`);
    return db.execAsync(fullSql);
}
