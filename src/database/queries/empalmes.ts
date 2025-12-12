import { EmpalmeCreate, EmpalmeUpdate } from "@/src/types/empalme";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, selectWithJoinBuilder, softDeleteBuilder, updateBuilder } from "../builder";

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

export async function getEmpalmesByLoteoId(db: SQLiteDatabase, id_loteo: number) {
    return await selectWithJoinBuilder(
        db,
        "empalmes",
        "soportes",
        "empalmes.id_soporte = soportes.id",
        { id_loteo }
    );
}

export async function getEmpalmesBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    return await selectBuilder(db, "empalmes", { id_soporte });
}


export async function getEmpalmeById(db: SQLiteDatabase, id: number) {
    const result = await selectBuilder(db, "empalmes", { id });
    return result[0] || null;
}