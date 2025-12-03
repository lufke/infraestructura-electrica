import { TipoSoporte } from "./propiedades"
import { SyncData } from "./sync"

export interface Soporte extends SyncData {
    id: number
    tipo?: TipoSoporte
    latitud: number
    longitud: number
    altitud?: number
    precision?: number
    notas?: string
    id_loteo: number
}