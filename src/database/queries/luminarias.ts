import { LuminariaCreate, LuminariaUpdate } from "@/src/types/luminaria";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

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
