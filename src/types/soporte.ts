import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { soportes } from '@/src/database/drizzle/schema';

export type TipoSoporte = 'POSTE' | 'CAMARA';

export type Soporte = InferModel<typeof soportes>;
export type SoporteCreate = InferInsert<typeof soportes>;
export type SoporteUpdate = Partial<SoporteCreate> & { id: number };
