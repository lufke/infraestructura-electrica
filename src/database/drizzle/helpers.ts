import { InferInsertModel, InferSelectModel, Table } from 'drizzle-orm';

/**
 * Utility type to convert null to undefined in Drizzle-inferred types
 * This makes the types compatible with existing code that uses undefined instead of null
 */
export type NullToUndefined<T> = {
    [K in keyof T]: T[K] extends null ? undefined : T[K] extends null | infer U ? U | undefined : T[K];
};

/**
 * Helper to infer a select model with null converted to undefined
 */
export type InferModel<T extends Table> = NullToUndefined<InferSelectModel<T>>;

/**
 * Helper to infer an insert model with null converted to undefined
 */
export type InferInsert<T extends Table> = NullToUndefined<InferInsertModel<T>>;
