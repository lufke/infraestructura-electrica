import { Condicion, TipoLampara } from "./propiedades";
import { SyncData } from "./sync";

export interface Luminaria extends SyncData {
    id: number
    tipo_lampara?: TipoLampara
    potencia?: number
    condicion?: Condicion
    notas?: string
    id_empalme?: number
    id_soporte: number
}
