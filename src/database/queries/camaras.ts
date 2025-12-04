import { CamaraCreate, CamaraUpdate } from "@/src/types/camara";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addCamara(db: SQLiteDatabase, data: Partial<CamaraCreate>) {
    return await insertBuilder(db, "camaras", data);
}

export async function updateCamara(db: SQLiteDatabase, id: number, data: Partial<CamaraUpdate>) {
    return await updateBuilder(db, "camaras", id, data);
}

export async function deleteCamara(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "camaras", id);
}

export async function hardDeleteCamara(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "camaras", id);
}

export async function getCamaras(db: SQLiteDatabase) {
    return await selectBuilder(db, "camaras");
}
