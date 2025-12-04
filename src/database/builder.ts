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
    SET ${assignments}
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
