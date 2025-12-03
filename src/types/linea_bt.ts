import { Condicion } from "./propiedades";
import { SyncData } from "./sync";

export interface LineaBT extends SyncData {
    id: number
    tipo?: string
    fases?: number
    seccion?: number
    largo?: number
    condicion?: Condicion
    id_subestacion: number
    id_soporte_inicio: number
    id_soporte_final: number
    notas?: string
}
