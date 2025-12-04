import { EmpalmeCreate, EmpalmeUpdate } from "@/src/types/empalme";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addEmpalme(db: SQLiteDatabase, data: Partial<EmpalmeCreate>) {
    return await insertBuilder(db, "empalmes", data);
}

export async function updateEmpalme(db: SQLiteDatabase, id: number, data: Partial<EmpalmeUpdate>) {
    return await updateBuilder(db, "empalmes", id, data);
}

export async function deleteEmpalme(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "empalmes", id);
}

export async function hardDeleteEmpalme(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "empalmes", id);
}

export async function getEmpalmes(db: SQLiteDatabase) {
    return await selectBuilder(db, "empalmes");
}
