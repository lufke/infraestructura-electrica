import { CamaraCreate, CamaraUpdate } from "@/src/types/camara";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addCamara(db: SQLiteDatabase, data: Partial<CamaraCreate>) {
    return await insertBuilder(db, "camaras", data);
}

export async function updateCamara(db: SQLiteDatabase, id: number, data: Partial<CamaraUpdate>) {
    return await updateBuilder(db, "camaras", id, data);
}

export async function deleteCamara(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "camaras", id);
}

export async function hardDeleteCamara(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "camaras", id);
}

export async function getCamaras(db: SQLiteDatabase) {
    return await selectBuilder(db, "camaras");
}

export async function getCamarasByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "camaras",
        "soportes",
        "camaras.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getCamarasBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "camaras", { id_soporte });
}

export async function getCamaraById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "camaras", { id });
    return result[0] || null;
}

