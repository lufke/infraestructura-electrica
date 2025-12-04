import { Condicion, MaterialConductor, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface EstructuraBase extends SyncData {
    nivel_tension?: NivelTension
    fases?: number
    material_conductor?: MaterialConductor
    descripcion?: string
    condicion: Condicion
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
