import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export type FijacionTirante = 'PISO' | 'POSTE MOZO' | 'RIEL' | string

export type TipoTirante = 'SIMPLE' | 'DOBLE' | string

export interface TiranteBase extends SyncData {
    nivel_tension?: NivelTension
    cantidad?: number
    tipo?: TipoTirante
    fijacion?: FijacionTirante
    condicion?: Condicion
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