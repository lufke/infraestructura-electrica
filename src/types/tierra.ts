import { Condicion } from "./propiedades"
import { SyncData } from "./sync"

export type TipoTierra = 'TP' | 'TS' | string

export interface TierraBase extends SyncData {
    tipo?: TipoTierra
    resistencia?: number
    condicion?: Condicion
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