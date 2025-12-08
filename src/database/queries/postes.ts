import { PosteCreate, PosteUpdate } from "@/src/types/poste";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

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

export async function getPostesByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "postes",
        "soportes",
        "postes.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getPostesBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "postes", { id_soporte });
}

