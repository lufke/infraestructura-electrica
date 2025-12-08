import { Condicion } from "./propiedades";
import { SyncData } from "./sync";

export type TipoLampara = 'LED' | 'HM' | 'HPS' | string

export interface LuminariaBase extends SyncData {
    tipo_lampara?: TipoLampara
    fase?: number
    potencia?: number
    condicion?: Condicion
    notas?: string
    id_subestacion?: number
    id_empalme?: number
    id_soporte: number
}

export interface Luminaria extends LuminariaBase {
    id: number
}

export type LuminariaCreate = LuminariaBase

export interface LuminariaUpdate extends Partial<LuminariaBase> {
    id: number
}

