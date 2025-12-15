import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { lineas_bt } from '@/src/database/drizzle/schema';

export type LineaBT = InferModel<typeof lineas_bt>;
export type LineaBTCreate = InferInsert<typeof lineas_bt>;
export type LineaBTUpdate = Partial<LineaBTCreate> & { id: number };
