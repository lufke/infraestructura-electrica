import { EstructuraCreate, EstructuraUpdate } from "@/src/types/estructura";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addEstructura(db: SQLiteDatabase, data: Partial<EstructuraCreate>) {
    return await insertBuilder(db, "estructuras", data);
}

export async function updateEstructura(db: SQLiteDatabase, id: number, data: Partial<EstructuraUpdate>) {
    return await updateBuilder(db, "estructuras", id, data);
}

export async function deleteEstructura(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "estructuras", id);
}

export async function hardDeleteEstructura(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "estructuras", id);
}

export async function getEstructuras(db: SQLiteDatabase) {
    return await selectBuilder(db, "estructuras");
}

export async function getEstructurasByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "estructuras",
        "soportes",
        "estructuras.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getEstructurasBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "estructuras", { id_soporte });
}

export async function getEstructuraById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "estructuras", { id });
    return result[0] || null;
}
