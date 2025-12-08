import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export type TipoSeccionamiento = 'FUS' | 'REC' | 'CUC' | 'ALD' | 'CODO' | string

export type PosicionSeccionamiento = 'ABIERTO' | 'CERRADO' | string

export interface SeccionamientoBase extends SyncData {
    tipo?: TipoSeccionamiento
    nivel_tension?: NivelTension
    fases?: number
    corriente?: number
    posicion?: PosicionSeccionamiento
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
