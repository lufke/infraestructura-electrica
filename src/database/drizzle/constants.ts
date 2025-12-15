// Constantes para CHECK constraints y validación de tipos
// Single Source of Truth para valores permitidos

export const NIVEL_TENSION_VALUES = ['BT', 'MT'] as const;
export const TIPO_SOPORTE_VALUES = ['POSTE', 'CAMARA'] as const;
export const MATERIAL_POSTE_VALUES = ['MADERA', 'CONCRETO', 'METAL'] as const;
export const CONDICION_VALUES = ['BUENO', 'REGULAR', 'MALO'] as const;
export const POSICION_SECCIONAMIENTO_VALUES = ['ABIERTO', 'CERRADO'] as const;
export const FIJACION_TIRANTE_VALUES = ['PISO', 'POSTE MOZO', 'RIEL'] as const;
export const TIPO_TIRANTE_VALUES = ['SIMPLE', 'DOBLE'] as const;
export const TIPO_TIERRA_VALUES = ['TP', 'TS'] as const;
export const TIPO_LAMPARA_VALUES = ['LED', 'HM', 'HPS'] as const;
export const MATERIAL_LINEA_VALUES = ['ALUMINIO', 'COBRE'] as const;
export const AISLACION_LINEA_VALUES = ['DESNUDO', 'AISLADO'] as const;
export const ACTIVO_VALUES = [0, 1] as const;
export const FASE_CONEXION_VALUES = ['R', 'S', 'T', 'RS', 'RT', 'ST', 'RST'] as const;

// Helper para generar SQL IN clause
export const sqlIn = (values: readonly (string | number)[]) => {
    return values.map(v => typeof v === 'string' ? `'${v}'` : v).join(',');
};
