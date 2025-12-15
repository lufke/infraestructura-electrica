import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { camaras } from '@/src/database/drizzle/schema';

export type Camara = InferModel<typeof camaras>;
export type CamaraCreate = InferInsert<typeof camaras>;
export type CamaraUpdate = Partial<CamaraCreate> & { id: number };