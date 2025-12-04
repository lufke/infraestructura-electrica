import { Condicion, TipoLampara } from "./propiedades";
import { SyncData } from "./sync";

export interface LuminariaBase extends SyncData {
    tipo_lampara?: TipoLampara
    fase?: number
    potencia?: number
    condicion?: Condicion
    notas?: string
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

