import { AislacionConductor, Condicion, MaterialConductor } from "./propiedades";
import { SyncData } from "./sync";

export interface LineaBTBase extends SyncData {
    tipo?: string
    fases?: number
    seccion?: number
    largo?: number
    condicion?: Condicion
    material?: MaterialConductor
    aislacion?: AislacionConductor
    id_subestacion?: number
    id_soporte_inicio: number
    id_soporte_final: number
    notas?: string
}

export interface LineaBT extends LineaBTBase {
    id: number
}

export type LineaBTCreate = LineaBTBase

export interface LineaBTUpdate extends Partial<LineaBTBase> {
    id: number
}
