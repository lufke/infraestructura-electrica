import { SyncData } from "./sync"

export type TipoSoporte = 'POSTE' | 'CAMARA' | string

export interface SoporteBase extends SyncData {
    tipo?: TipoSoporte
    latitud: number
    longitud: number
    altitud?: number
    precision?: number
    notas?: string
    id_loteo: number
}

export interface Soporte extends SoporteBase {
    id: number
}

export type SoporteCreate = SoporteBase

export interface SoporteUpdate extends Partial<SoporteBase> {
    id: number
}
