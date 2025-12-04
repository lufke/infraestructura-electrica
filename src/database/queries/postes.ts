import { PosteCreate, PosteUpdate } from "@/src/types/poste";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addPoste(db: SQLiteDatabase, data: Partial<PosteCreate>) {
    return await insertBuilder(db, "postes", data);
}

export async function updatePoste(db: SQLiteDatabase, id: number, data: Partial<PosteUpdate>) {
    return await updateBuilder(db, "postes", id, data);
}

export async function deletePoste(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "postes", id);
}

export async function hardDeletePoste(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "postes", id);
}

export async function getPostes(db: SQLiteDatabase) {
    return await selectBuilder(db, "postes");
}
