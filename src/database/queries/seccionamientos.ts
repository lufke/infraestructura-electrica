import { SeccionamientoCreate, SeccionamientoUpdate } from "@/src/types/seccionamiento";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addSeccionamiento(db: SQLiteDatabase, data: Partial<SeccionamientoCreate>) {
    return await insertBuilder(db, "seccionamientos", data);
}

export async function updateSeccionamiento(db: SQLiteDatabase, id: number, data: Partial<SeccionamientoUpdate>) {
    return await updateBuilder(db, "seccionamientos", id, data);
}

export async function deleteSeccionamiento(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "seccionamientos", id);
}

export async function hardDeleteSeccionamiento(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "seccionamientos", id);
}

export async function getSeccionamientos(db: SQLiteDatabase) {
    return await selectBuilder(db, "seccionamientos");
}
