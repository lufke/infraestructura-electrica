import { InferInsert, InferModel } from '@/src/database/drizzle/helpers';
import { loteos } from "@/src/database/drizzle/schema";

/**
 * 🔹 Single Source of Truth: Derived directly from Drizzle Schema!
 */
export type Loteo = InferModel<typeof loteos>;
export type LoteoCreate = InferInsert<typeof loteos>;
export type LoteoUpdate = Partial<LoteoCreate> & { id: number };
