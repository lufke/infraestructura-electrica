import { MATERIAL_POSTE_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { postes } from '@/src/database/drizzle/schema';

export type MaterialPoste = typeof MATERIAL_POSTE_VALUES[number];

export type Poste = InferModel<typeof postes>;
export type PosteCreate = InferInsert<typeof postes>;
export type PosteUpdate = Partial<PosteCreate> & { id: number };
