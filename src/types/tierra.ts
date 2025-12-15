import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { tierras } from '@/src/database/drizzle/schema';

export type TipoTierra = 'TP' | 'TS';

export type Tierra = InferModel<typeof tierras>;
export type TierraCreate = InferInsert<typeof tierras>;
export type TierraUpdate = Partial<TierraCreate> & { id: number };