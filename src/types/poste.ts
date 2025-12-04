import { Condicion, MaterialPoste } from "./propiedades"
import { SyncData } from "./sync"

export interface PosteBase extends SyncData {
    altura?: number
    material?: MaterialPoste
    placa?: string
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
