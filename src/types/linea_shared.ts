import { AISLACION_LINEA_VALUES, MATERIAL_LINEA_VALUES } from '@/src/database/drizzle/constants';

// Tipos compartidos para líneas MT y BT - derivados de constantes Drizzle
export type MaterialLinea = typeof MATERIAL_LINEA_VALUES[number];
export type AislacionLinea = typeof AISLACION_LINEA_VALUES[number];
