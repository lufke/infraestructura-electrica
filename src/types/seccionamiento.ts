import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface SeccionamientoBase extends SyncData {
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

export interface Seccionamiento extends SeccionamientoBase {
    id: number
}

export type SeccionamientoCreate = SeccionamientoBase

export interface SeccionamientoUpdate extends Partial<SeccionamientoBase> {
    id: number
}
