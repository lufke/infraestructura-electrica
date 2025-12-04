import { NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface EmpalmeBase extends SyncData {
    n_medidor: string
    nivel_tension?: NivelTension
    fases?: number
    capacidad?: number
    direccion?: string
    parcela?: string
    activo?: number
    id_soporte?: number
    id_subestacion?: number
    notas?: string
}

export interface Empalme extends EmpalmeBase {
    id: number
}

export type EmpalmeCreate = EmpalmeBase

export interface EmpalmeUpdate extends Partial<EmpalmeBase> {
    id: number
}
