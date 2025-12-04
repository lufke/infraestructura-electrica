import { LoteoCreate, LoteoUpdate } from "@/src/types/loteo";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteBuilder, insertBuilder, selectBuilder, softDeleteBuilder, updateBuilder } from "../builder";

export async function addLoteo(db: SQLiteDatabase, data: Partial<LoteoCreate>) {
    return await insertBuilder(db, "loteos", data);
}

export async function updateLoteo(db: SQLiteDatabase, id: number, data: Partial<LoteoUpdate>) {
    return await updateBuilder(db, "loteos", id, data);
}

export async function deleteLoteo(db: SQLiteDatabase, id: number) {
    return await softDeleteBuilder(db, "loteos", id);
}

export async function hardDeleteLoteo(db: SQLiteDatabase, id: number) {
    return await deleteBuilder(db, "loteos", id);
}

export async function getLoteos(db: SQLiteDatabase) {
    return await selectBuilder(db, "loteos");
}
