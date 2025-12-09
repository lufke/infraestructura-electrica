import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export type TipoSeccionamientoMT = 'FUS' | 'REC' | 'CUC' | 'ALD' | 'CODO' | string
export type TipoSeccionamientoBT = 'FUS' | 'AUT' | string

export type PosicionSeccionamiento = 'ABIERTO' | 'CERRADO' | string

export interface SeccionamientoBase extends SyncData {
    tipo?: TipoSeccionamientoMT | TipoSeccionamientoBT
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
