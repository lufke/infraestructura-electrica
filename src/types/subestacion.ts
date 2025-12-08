import { Condicion } from "./propiedades"
import { SyncData } from "./sync"


export interface SubestacionBase extends SyncData {
    nombre?: string
    tension?: number
    potencia?: number
    fases?: number
    marca?: string
    serie?: string
    condicion?: Condicion
    letrero?: string
    notas?: string
    id_soporte: number
}

export interface Subestacion extends SubestacionBase {
    id: number
}

export type SubestacionCreate = SubestacionBase

export interface SubestacionUpdate extends Partial<SubestacionBase> {
    id: number
}
