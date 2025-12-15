import { TIPO_TIERRA_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { tierras } from '@/src/database/drizzle/schema';

export type TipoTierra = typeof TIPO_TIERRA_VALUES[number];

export type Tierra = InferModel<typeof tierras>;
export type TierraCreate = InferInsert<typeof tierras>;
export type TierraUpdate = Partial<TierraCreate> & { id: number };