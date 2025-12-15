import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { subestaciones } from '@/src/database/drizzle/schema';

export type Subestacion = InferModel<typeof subestaciones>;
export type SubestacionCreate = InferInsert<typeof subestaciones>;
export type SubestacionUpdate = Partial<SubestacionCreate> & { id: number };
