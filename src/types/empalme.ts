import { NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface Empalme extends SyncData {
    id: number
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