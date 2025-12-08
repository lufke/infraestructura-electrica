import { Condicion, MaterialConductor, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export type TipoEstructuraBT = 'PASO' | 'REMATE' | 'DERIVACION' | 'LIMITE DE ZONA'
export type TipoEstructuraMT = 'PORTANTE' | 'REMATE' | 'ANCLAJE' | 'ARRANQUE'

export interface EstructuraBase extends SyncData {
    nivel_tension?: NivelTension
    fases?: number
    material_conductor?: MaterialConductor
    descripcion?: TipoEstructuraBT | TipoEstructuraMT | string
    condicion?: Condicion
    notas?: string
    id_soporte: number
}

export interface Estructura extends EstructuraBase {
    id: number
}

export type EstructuraCreate = EstructuraBase

export interface EstructuraUpdate extends Partial<EstructuraBase> {
    id: number
}
