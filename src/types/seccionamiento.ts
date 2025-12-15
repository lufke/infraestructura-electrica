import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { seccionamientos } from '@/src/database/drizzle/schema';

export type PosicionSeccionamiento = 'ABIERTO' | 'CERRADO';

export type Seccionamiento = InferModel<typeof seccionamientos>;
export type SeccionamientoCreate = InferInsert<typeof seccionamientos>;
export type SeccionamientoUpdate = Partial<SeccionamientoCreate> & { id: number };
