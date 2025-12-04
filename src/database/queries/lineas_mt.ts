import { LineaMTCreate, LineaMTUpdate } from "@/src/types/linea_mt";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLineaMT(db: SQLiteDatabase, data: Partial<LineaMTCreate>) {
    return await insertBuilder(db, "lineas_mt", data);
}

export async function updateLineaMT(db: SQLiteDatabase, id: number, data: Partial<LineaMTUpdate>) {
    return await updateBuilder(db, "lineas_mt", id, data);
}

export async function deleteLineaMT(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "lineas_mt", id);
}

export async function hardDeleteLineaMT(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "lineas_mt", id);
}

export async function getLineasMT(db: SQLiteDatabase) {
    return await selectBuilder(db, "lineas_mt");
}
