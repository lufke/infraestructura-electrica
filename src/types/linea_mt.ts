import { Condicion } from "./propiedades";
import { SyncData } from "./sync";

export interface LineaMT extends SyncData {
    id: number
    tipo?: string
    fases?: number
    seccion?: number
    largo?: number
    condicion: Condicion
    id_soporte_inicio: number
    id_soporte_final: number
    notas?: string
}
