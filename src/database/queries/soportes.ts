import { SoporteCreate, SoporteUpdate } from "@/src/types/soporte";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addSoporte(db: SQLiteDatabase, data: Partial<SoporteCreate>) {
    return await insertBuilder(db, "soportes", data);
}

export async function updateSoporte(db: SQLiteDatabase, id: number, data: Partial<SoporteUpdate>) {
    return await updateBuilder(db, "soportes", id, data);
}

export async function deleteSoporte(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "soportes", id);
}

export async function hardDeleteSoporte(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "soportes", id);
}

export async function getSoportes(db: SQLiteDatabase) {
    return await selectBuilder(db, "soportes");
}

export async function getSoportesByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectBuilder(db, "soportes", { id_loteo });
}

export async function getSoporteById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "soportes", { id });
    return result[0] || null;
}

