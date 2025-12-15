import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { postes } from '@/src/database/drizzle/schema';

export type MaterialPoste = 'MADERA' | 'CONCRETO' | 'METAL' | string;

export type Poste = InferModel<typeof postes>;
export type PosteCreate = InferInsert<typeof postes>;
export type PosteUpdate = Partial<PosteCreate> & { id: number };
