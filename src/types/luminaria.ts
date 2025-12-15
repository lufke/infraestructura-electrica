import { TIPO_LAMPARA_VALUES } from '@/src/database/drizzle/constants';
import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { luminarias } from '@/src/database/drizzle/schema';

export type TipoLampara = typeof TIPO_LAMPARA_VALUES[number];

export type Luminaria = InferModel<typeof luminarias>;
export type LuminariaCreate = InferInsert<typeof luminarias>;
export type LuminariaUpdate = Partial<LuminariaCreate> & { id: number };
