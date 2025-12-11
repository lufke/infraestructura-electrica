// src/database/queries/lineas_mt.ts
import { LineaMTCreate, LineaMTUpdate } from "@/src/types/linea_mt";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLineaMT(db: SQLiteDatabase, data: Partial<LineaMTCreate>) {
    return await insertBuilder(db, "lineas_mt", data);
}

export async function updateLineaMT(db: SQLiteDatabase, id: number, data: Partial<LineaMTUpdate>) {
    return await updateBuilder(db, "lineas_mt", id, data);
}

export async function deleteLineaMT(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "lineas_mt", id);
}

export async function hardDeleteLineaMT(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "lineas_mt", id);
}

export async function getLineasMT(db: SQLiteDatabase) {
    return await selectBuilder(db, "lineas_mt");
}

export async function getLineasMTByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "lineas_mt",
        "soportes",
        "lineas_mt.id_soporte_inicio = soportes.id",
        { id_loteo }
    );
}

export async function getLineasMTBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    const sql = `
        SELECT * FROM lineas_mt 
        WHERE (id_soporte_inicio = ? OR id_soporte_final = ?)
        AND deleted = 0
    `;
    return await db.getAllAsync(sql, [id_soporte, id_soporte]);
}

export async function getLineaMTById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "lineas_mt", { id });
    return result[0] || null;
}

// Función específica para obtener líneas MT con información de soportes
export async function getLineasMTConSoportes(db: SQLiteDatabase, id_loteo: number) {
    const sql = `
        SELECT 
            lm.*,
            s_inicio.latitud as inicio_latitud,
            s_inicio.longitud as inicio_longitud,
            s_final.latitud as final_latitud,
            s_final.longitud as final_longitud
        FROM lineas_mt lm
        INNER JOIN soportes s_inicio ON lm.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lm.id_soporte_final = s_final.id
        WHERE s_inicio.id_loteo = ? 
        AND s_final.id_loteo = ?
        AND lm.deleted = 0
    `;
    return await db.getAllAsync(sql, [id_loteo, id_loteo]);
}