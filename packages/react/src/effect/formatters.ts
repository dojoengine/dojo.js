import type { Token, TokenBalance } from "@dojoengine/torii-wasm";

/**
 * Context provided to field-level formatters
 */
export interface FieldFormatterContext {
    fieldName: string;
    modelKey: string;
    schemaKey: string;
    entityId: string;
}

/**
 * Context provided to model-level formatters
 */
export interface ModelFormatterContext {
    modelKey: string;
    schemaKey: string;
    entityId: string;
}

/**
 * Field-level formatter function type
 * Transforms a single field value within a model
 */
export type FieldFormatter<T = unknown, R = unknown> = (
    value: T,
    context: FieldFormatterContext
) => R;

/**
 * Model-level formatter function type
 * Transforms an entire model object
 */
export type ModelFormatter<
    T extends Record<string, unknown> = Record<string, unknown>,
    R extends Record<string, unknown> = Record<string, unknown>,
> = (model: T, context: ModelFormatterContext) => R;

/**
 * Token formatter function type
 * Transforms a token object based on contract address
 */
export type TokenFormatter = (token: Token) => Token;

/**
 * Token balance formatter function type
 * Transforms a token balance object based on contract address
 */
export type TokenBalanceFormatter = (balance: TokenBalance) => TokenBalance;

/**
 * Registry of data formatters
 */
export interface DataFormatters {
    /**
     * Model-level formatters keyed by "SchemaKey-ModelKey" (e.g., "NUMS-Game")
     * These transform entire model objects
     */
    models?: Record<string, ModelFormatter>;

    /**
     * Field-level formatters keyed by "SchemaKey-ModelKey.fieldName" (e.g., "NUMS-Game.score")
     * These transform individual field values within models
     */
    fields?: Record<string, FieldFormatter>;

    /**
     * Token formatters keyed by contract address
     * These transform token objects from specific contracts
     */
    tokens?: Record<string, TokenFormatter>;

    /**
     * Token balance formatters keyed by contract address
     * These transform token balance objects from specific contracts
     */
    tokenBalances?: Record<string, TokenBalanceFormatter>;
}

/**
 * Merges two DataFormatters objects, with overrides taking precedence
 */
export function mergeFormatters(
    base: DataFormatters | undefined,
    overrides: DataFormatters | undefined
): DataFormatters | undefined {
    if (!base && !overrides) return undefined;
    if (!base) return overrides;
    if (!overrides) return base;

    return {
        models: { ...base.models, ...overrides.models },
        fields: { ...base.fields, ...overrides.fields },
        tokens: { ...base.tokens, ...overrides.tokens },
        tokenBalances: { ...base.tokenBalances, ...overrides.tokenBalances },
    };
}
