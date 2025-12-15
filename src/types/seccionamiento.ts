import { POSICION_SECCIONAMIENTO_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { seccionamientos } from '@/src/database/drizzle/schema';

export type PosicionSeccionamiento = typeof POSICION_SECCIONAMIENTO_VALUES[number];

export type Seccionamiento = InferModel<typeof seccionamientos>;
export type SeccionamientoCreate = InferInsert<typeof seccionamientos>;
export type SeccionamientoUpdate = Partial<SeccionamientoCreate> & { id: number };
