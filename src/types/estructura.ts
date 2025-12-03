import { Condicion, MaterialConductor, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface Estructura extends SyncData {
    id: number
    nivel_tension?: NivelTension
    fases?: number
    material_conductor?: MaterialConductor
    descripcion?: string
    condicion: Condicion
    notas?: string
    id_soporte: number
}