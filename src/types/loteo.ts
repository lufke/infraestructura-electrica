import { NivelTension } from "./propiedades";
import { SyncData } from "./sync";

export interface Loteo extends SyncData {
    id: number
    nombre: string
    direccion?: string
    propietario?: string
    telefono?: string
    correo?: string
    comuna?: string
    distribuidora?: string
    n_cliente?: string
    tension_mt?: number
    tension_bt?: number
    nivel_tension?: NivelTension
    latitud?: number
    longitud?: number
    notas?: string
}