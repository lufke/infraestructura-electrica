import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { estructuras } from '@/src/database/drizzle/schema';

export type Estructura = InferModel<typeof estructuras>;
export type EstructuraCreate = InferInsert<typeof estructuras>;
export type EstructuraUpdate = Partial<EstructuraCreate> & { id: number };
