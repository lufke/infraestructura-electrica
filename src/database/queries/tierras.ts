import { TierraCreate, TierraUpdate } from "@/src/types/tierra";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addTierra(db: SQLiteDatabase, data: Partial<TierraCreate>) {
    return await insertBuilder(db, "tierras", data);
}

export async function updateTierra(db: SQLiteDatabase, id: number, data: Partial<TierraUpdate>) {
    return await updateBuilder(db, "tierras", id, data);
}

export async function deleteTierra(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "tierras", id);
}

export async function hardDeleteTierra(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "tierras", id);
}

export async function getTierras(db: SQLiteDatabase) {
    return await selectBuilder(db, "tierras");
}

export async function getTierrasByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "tierras",
        "soportes",
        "tierras.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getTierrasBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "tierras", { id_soporte });
}

export async function getTierraById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "tierras", { id });
    return result[0] || null;
}
