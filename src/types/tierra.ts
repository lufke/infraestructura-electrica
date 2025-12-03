import { Condicion, TipoTierra } from "./propiedades"
import { SyncData } from "./sync"

export interface Tierra extends SyncData {
    id: number
    tipo?: TipoTierra
    resistencia: number
    condicion: Condicion
    notas?: string
    id_soporte: number
}