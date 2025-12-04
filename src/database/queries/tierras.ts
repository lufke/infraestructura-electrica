import { TierraCreate, TierraUpdate } from "@/src/types/tierra";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

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
