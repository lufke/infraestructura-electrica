import { FIJACION_TIRANTE_VALUES, TIPO_TIRANTE_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { tirantes } from '@/src/database/drizzle/schema';

export type FijacionTirante = typeof FIJACION_TIRANTE_VALUES[number];
export type TipoTirante = typeof TIPO_TIRANTE_VALUES[number];

export type Tirante = InferModel<typeof tirantes>;
export type TiranteCreate = InferInsert<typeof tirantes>;
export type TiranteUpdate = Partial<TiranteCreate> & { id: number };