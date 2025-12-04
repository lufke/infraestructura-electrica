import { Condicion, FijacionTirante, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface TiranteBase extends SyncData {
    nivel_tension?: NivelTension
    cantidad?: number
    fijacion?: FijacionTirante
    condicion: Condicion
    notas?: string
    id_soporte: number
}

export interface Tirante extends TiranteBase {
    id: number
}

export type TiranteCreate = TiranteBase

export interface TiranteUpdate extends Partial<TiranteBase> {
    id: number
}