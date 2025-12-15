import { TIPO_SOPORTE_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { soportes } from '@/src/database/drizzle/schema';

export type TipoSoporte = typeof TIPO_SOPORTE_VALUES[number];

export type Soporte = InferModel<typeof soportes>;
export type SoporteCreate = InferInsert<typeof soportes>;
export type SoporteUpdate = Partial<SoporteCreate> & { id: number };
