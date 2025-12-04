import { SubestacionCreate, SubestacionUpdate } from "@/src/types/subestacion";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addSubestacion(db: SQLiteDatabase, data: Partial<SubestacionCreate>) {
    return await insertBuilder(db, "subestaciones", data);
}

export async function updateSubestacion(db: SQLiteDatabase, id: number, data: Partial<SubestacionUpdate>) {
    return await updateBuilder(db, "subestaciones", id, data);
}

export async function deleteSubestacion(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "subestaciones", id);
}

export async function hardDeleteSubestacion(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "subestaciones", id);
}

export async function getSubestaciones(db: SQLiteDatabase) {
    return await selectBuilder(db, "subestaciones");
}
