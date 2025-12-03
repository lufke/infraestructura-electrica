import { Condicion, TipoCamara } from "./propiedades"
import { SyncData } from "./sync"

export interface Camara extends SyncData {
    id: number
    tipo_camara: TipoCamara
    placa?: string
    condicion: Condicion
    notas?: string
    id_soporte: string
}