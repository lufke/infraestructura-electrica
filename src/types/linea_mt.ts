import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { lineas_mt } from '@/src/database/drizzle/schema';

export type LineaMT = InferModel<typeof lineas_mt>;
export type LineaMTCreate = InferInsert<typeof lineas_mt>;
export type LineaMTUpdate = Partial<LineaMTCreate> & { id: number };
