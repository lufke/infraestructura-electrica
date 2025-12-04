import { LineaBTCreate, LineaBTUpdate } from "@/src/types/linea_bt";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLineaBT(db: SQLiteDatabase, data: Partial<LineaBTCreate>) {
    return await insertBuilder(db, "lineas_bt", data);
}

export async function updateLineaBT(db: SQLiteDatabase, id: number, data: Partial<LineaBTUpdate>) {
    return await updateBuilder(db, "lineas_bt", id, data);
}

export async function deleteLineaBT(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "lineas_bt", id);
}

export async function hardDeleteLineaBT(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "lineas_bt", id);
}

export async function getLineasBT(db: SQLiteDatabase) {
    return await selectBuilder(db, "lineas_bt");
}
