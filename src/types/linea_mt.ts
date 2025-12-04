import { Condicion } from "./propiedades";
import { SyncData } from "./sync";

export interface LineaMTBase extends SyncData {
    tipo?: string
    fases?: number
    seccion?: number
    largo?: number
    condicion: Condicion
    id_soporte_inicio: number
    id_soporte_final: number
    notas?: string
}

export interface LineaMT extends LineaMTBase {
    id: number
}

export type LineaMTCreate = LineaMTBase

export interface LineaMTUpdate extends Partial<LineaMTBase> {
    id: number
}