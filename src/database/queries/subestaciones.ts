import { SubestacionCreate, SubestacionUpdate } from "@/src/types/subestacion";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

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

export async function getSubestacionesByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "subestaciones",
        "soportes",
        "subestaciones.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getSubestacionesBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "subestaciones", { id_soporte });
}

