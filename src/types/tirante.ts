import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { tirantes } from '@/src/database/drizzle/schema';

export type FijacionTirante = 'PISO' | 'POSTE MOZO' | 'RIEL';
export type TipoTirante = 'SIMPLE' | 'DOBLE';

export type Tirante = InferModel<typeof tirantes>;
export type TiranteCreate = InferInsert<typeof tirantes>;
export type TiranteUpdate = Partial<TiranteCreate> & { id: number };