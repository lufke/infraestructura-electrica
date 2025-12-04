import { TiranteCreate, TiranteUpdate } from "@/src/types/tirante";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addTirante(db: SQLiteDatabase, data: Partial<TiranteCreate>) {
    return await insertBuilder(db, "tirantes", data);
}

export async function updateTirante(db: SQLiteDatabase, id: number, data: Partial<TiranteUpdate>) {
    return await updateBuilder(db, "tirantes", id, data);
}

export async function deleteTirante(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "tirantes", id);
}

export async function hardDeleteTirante(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "tirantes", id);
}

export async function getTirantes(db: SQLiteDatabase) {
    return await selectBuilder(db, "tirantes");
}
