import { Condicion, NivelTension } from "./propiedades"
import { SyncData } from "./sync"

export type MaterialPoste = 'MADERA' | 'CONCRETO' | 'METAL' | string

export interface PosteBase extends SyncData {
    placa?: string
    material?: MaterialPoste
    altura_nivel_tension?: NivelTension
    altura?: number
    condicion?: Condicion
    notas?: string
    id_soporte: number
}

export interface Poste extends PosteBase {
    id: number
}

export type PosteCreate = PosteBase

export interface PosteUpdate extends Partial<PosteBase> {
    id: number
}
