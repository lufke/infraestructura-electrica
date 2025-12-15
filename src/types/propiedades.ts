import {
    AISLACION_LINEA_VALUES,
    CONDICION_VALUES,
    FASE_CONEXION_VALUES,
    MATERIAL_LINEA_VALUES,
    NIVEL_TENSION_VALUES
} from '@/src/database/drizzle/constants';

export type NivelTension = typeof NIVEL_TENSION_VALUES[number];
export type Condicion = typeof CONDICION_VALUES[number];
export type MaterialConductor = typeof MATERIAL_LINEA_VALUES[number];
export type AislacionConductor = typeof AISLACION_LINEA_VALUES[number];
export type FaseConexion = typeof FASE_CONEXION_VALUES[number];
