import { Condicion, MaterialPoste } from "./propiedades"
import { SyncData } from "./sync"

export interface Poste extends SyncData {
    id: number
    altura?: number
    material?: MaterialPoste
    placa?: string
    condicion?: Condicion
    notas?: string
    id_soporte: number
}