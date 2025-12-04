import { Condicion, TipoTierra } from "./propiedades"
import { SyncData } from "./sync"

export interface TierraBase extends SyncData {
    tipo?: TipoTierra
    resistencia: number
    condicion: Condicion
    notas?: string
    id_soporte: number
}

export interface Tierra extends TierraBase {
    id: number
}

export type TierraCreate = TierraBase

export interface TierraUpdate extends Partial<TierraBase> {
    id: number
}