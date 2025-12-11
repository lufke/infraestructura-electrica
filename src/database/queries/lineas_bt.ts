// src/database/queries/lineas_bt.ts
import { LineaBTCreate, LineaBTUpdate } from "@/src/types/linea_bt";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLineaBT(db: SQLiteDatabase, data: Partial<LineaBTCreate>) {
    return await insertBuilder(db, "lineas_bt", data);
}

export async function updateLineaBT(db: SQLiteDatabase, id: number, data: Partial<LineaBTUpdate>) {
    return await updateBuilder(db, "lineas_bt", id, data);
}

export async function deleteLineaBT(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "lineas_bt", id);
}

export async function hardDeleteLineaBT(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "lineas_bt", id);
}

export async function getLineasBT(db: SQLiteDatabase) {
    return await selectBuilder(db, "lineas_bt");
}

export async function getLineasBTByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "lineas_bt",
        "soportes",
        "lineas_bt.id_soporte_inicio = soportes.id",
        { id_loteo }
    );
}

export async function getLineasBTBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    const sql = `
        SELECT * FROM lineas_bt 
        WHERE (id_soporte_inicio = ? OR id_soporte_final = ?)
        AND deleted = 0
    `;
    return await db.getAllAsync(sql, [id_soporte, id_soporte]);
}

export async function getLineaBTById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "lineas_bt", { id });
    return result[0] || null;
}

// Función específica para obtener líneas BT con información de soportes
export async function getLineasBTConSoportes(db: SQLiteDatabase, id_loteo: number) {
    const sql = `
        SELECT 
            lb.*,
            s_inicio.latitud as inicio_latitud,
            s_inicio.longitud as inicio_longitud,
            s_final.latitud as final_latitud,
            s_final.longitud as final_longitud
        FROM lineas_bt lb
        INNER JOIN soportes s_inicio ON lb.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lb.id_soporte_final = s_final.id
        WHERE s_inicio.id_loteo = ? 
        AND s_final.id_loteo = ?
        AND lb.deleted = 0
    `;
    return await db.getAllAsync(sql, [id_loteo, id_loteo]);
}