import { Condicion } from "./propiedades"
import { SyncData } from "./sync"


export interface Subestacion extends SyncData {
    id: number
    nombre?: string
    tension?: number
    potencia?: number
    fases?: number
    marca?: string
    serie?: string
    condicion: Condicion
    letrero?: string
    notas?: string
    id_soporte: number
}