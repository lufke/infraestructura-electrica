import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { empalmes } from '@/src/database/drizzle/schema';

export type Empalme = InferModel<typeof empalmes>;
export type EmpalmeCreate = InferInsert<typeof empalmes>;
export type EmpalmeUpdate = Partial<EmpalmeCreate> & { id: number };
