import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface Seccionamiento extends SyncData {
    id: number
    tipo?: string
    nivel_tension?: NivelTension
    fases?: number
    corriente?: number
    posicion?: 'ABIERTO' | 'CERRADO' | string
    condicion?: Condicion
    letrero?: string
    notas?: string
    id_soporte: number
}