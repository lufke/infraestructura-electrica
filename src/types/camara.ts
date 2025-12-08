import { Condicion } from "./propiedades"
import { SyncData } from "./sync"

export type TipoCamara = 'A' | 'B' | 'C' | string

export interface CamaraBase extends SyncData {
    tipo_camara: TipoCamara
    placa?: string
    condicion?: Condicion
    notas?: string
    id_soporte: number
}

export interface Camara extends CamaraBase {
    id: number
}

export type CamaraCreate = CamaraBase

export interface CamaraUpdate extends Partial<CamaraBase> {
    id: number
}