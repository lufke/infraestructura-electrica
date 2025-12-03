import { Condicion, FijacionTirante, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export interface Tirante extends SyncData {
    id: number
    nivel_tension?: NivelTension
    cantidad?: number
    fijacion?: FijacionTirante
    condicion: Condicion
    notas?: string
    id_soporte: number
}