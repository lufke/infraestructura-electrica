import { LuminariaCreate, LuminariaUpdate } from "@/src/types/luminaria";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLuminaria(db: SQLiteDatabase, data: Partial<LuminariaCreate>) {
    return await insertBuilder(db, "luminarias", data);
}

export async function updateLuminaria(db: SQLiteDatabase, id: number, data: Partial<LuminariaUpdate>) {
    return await updateBuilder(db, "luminarias", id, data);
}

export async function deleteLuminaria(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "luminarias", id);
}

export async function hardDeleteLuminaria(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "luminarias", id);
}

export async function getLuminarias(db: SQLiteDatabase) {
    return await selectBuilder(db, "luminarias");
}

export async function getLuminariasByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "luminarias",
        "soportes",
        "luminarias.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getLuminariasBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "luminarias", { id_soporte });
}

export async function getLuminariaById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "luminarias", { id });
    return result[0] || null;
}
