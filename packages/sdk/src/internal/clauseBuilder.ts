import {
    Clause,
    ComparisonOperator,
    MemberValue,
    PatternMatching,
} from "@dojoengine/torii-wasm/node";
import {
    convertToPrimitive,
    type MemberValueParam,
} from "../internal/convertToMemberValue.ts";
import { type BigNumberish, shortString } from "starknet";
import type { SchemaType } from "../internal/types.ts";

type ClauseBuilderInterface = {
    build(): Clause;
};

// Helper types for nested model structure
type ModelPath<T, K extends keyof T> = K extends string
    ? T[K] extends Record<string, any>
        ? {
              [SubK in keyof T[K]]: `${K}-${SubK & string}`;
          }[keyof T[K]]
        : never
    : never;

type GetModelType<
    T,
    Path extends string
> = Path extends `${infer Namespace}-${infer Model}`
    ? Namespace extends keyof T
        ? Model extends keyof T[Namespace]
            ? T[Namespace][Model]
            : never
        : never
    : never;

/**
 * Saves some keyboard strokes to get a KeysClause.
 *
 * @param models - the models you want to query, has to be in form of ns-Model
 * @param keys - the keys that has the model. You can use `undefined` as a wildcard to match any key
 * @param pattern - either VariableLen or FixedLen - to check exact match of key number
 * @return ClauseBuilder<T>
 */
export function KeysClause<T extends SchemaType>(
    models: ModelPath<T, keyof T>[],
    keys: (string | undefined)[],
    pattern: PatternMatching = "VariableLen"
): ClauseBuilder<T> {
    return new ClauseBuilder<T>().keys(models, keys, pattern);
}

/**
 * Saves some keyboard strokes to get a HashedKeysClause.
 *
 * @param keys - the hashed_keys (entityId) that you want to query over
 * @return ClauseBuilder<T>
 */
export function HashedKeysClause<T extends SchemaType>(
    keys: BigNumberish[]
): ClauseBuilder<T> {
    return new ClauseBuilder<T>().hashed_keys(keys);
}

/**
 * Saves some keyboard strokes to get a MemberClause.
 *
 * @template T - the schema type
 * @param model - the model you want to query, has to be in form of ns-Model
 * @param member - the member of the model on which you want to apply operator
 * @param operator - the operator to apply
 * @param value - the value to operate on.
 * @return ClauseBuilder<T>
 */
export function MemberClause<
    T extends SchemaType,
    Path extends ModelPath<T, keyof T>,
    M extends keyof GetModelType<T, ModelPath<T, keyof T>>
>(
    model: Path,
    member: M & string,
    operator: ComparisonOperator,
    value:
        | GetModelType<T, Path>[M]
        | GetModelType<T, Path>[M][]
        | MemberValueParam
): ClauseBuilder<T> {
    return new ClauseBuilder<T>().where(model, member, operator, value);
}

/**
 * Saves some keyboard strokes to get a Composite "Or" Clause
 *
 * @template T - the schema type
 * @param clauses - the inner clauses that you want to compose
 * @return CompositeBuilder<T>
 */
export function AndComposeClause<T extends SchemaType>(
    clauses: ClauseBuilderInterface[]
): CompositeBuilder<T> {
    return new ClauseBuilder<T>().compose().and(clauses);
}

/**
 * Saves some keyboard strokes to get a Composite "And" Clause
 * @template T - the schema type
 * @param clauses - the inner clauses that you want to compose
 * @return CompositeBuilder<T>
 */
export function OrComposeClause<T extends SchemaType>(
    clauses: ClauseBuilderInterface[]
): CompositeBuilder<T> {
    return new ClauseBuilder<T>().compose().or(clauses);
}

export class ClauseBuilder<T extends SchemaType> {
    private clause: Clause;

    constructor() {
        // @ts-expect-error It's ok if it's not assignable here.
        this.clause = {};
    }

    /**
     * Create a clause based on entity keys
     */
    keys(
        models: ModelPath<T, keyof T>[],
        keys: (string | undefined)[],
        pattern: PatternMatching = "VariableLen"
    ): ClauseBuilder<T> {
        this.clause = {
            Keys: {
                keys: keys.length === 0 ? [undefined] : keys,
                pattern_matching: pattern,
                models,
            },
        };
        return this;
    }

    /**
     * Create a hashed keys clause based on entity keys
     * keys: an array of your keys array (no need to hash it, just pass raw keys)
     */
    hashed_keys(keys: BigNumberish[]): ClauseBuilder<T> {
        const hexKeys = keys.map((k, index) => {
            try {
                // Convert to BigInt for robust handling of different input types
                const num = typeof k === "string" ? BigInt(k) : BigInt(k);
                // Convert to hex string with 0x prefix
                return `0x${num.toString(16)}`;
            } catch (error) {
                throw new Error(
                    `Invalid key value at index ${index}: ${k}. Expected a valid BigNumberish value.`
                );
            }
        });

        this.clause = {
            HashedKeys: hexKeys,
        };
        return this;
    }

    /**
     * Create a member clause for comparing values
     */
    where<
        Path extends ModelPath<T, keyof T>,
        M extends keyof GetModelType<T, Path>
    >(
        model: Path,
        member: M & string,
        operator: ComparisonOperator,
        value:
            | GetModelType<T, Path>[M]
            | GetModelType<T, Path>[M][]
            | MemberValueParam
    ): ClauseBuilder<T> {
        const memberValue: MemberValue = Array.isArray(value)
            ? {
                  List: value.map((i) =>
                      convertToPrimitive(i, shortString.encodeShortString)
                  ),
              }
            : convertToPrimitive(value, shortString.encodeShortString);

        this.clause = {
            Member: {
                model,
                member,
                operator,
                value: memberValue,
            },
        };
        return this;
    }

    /**
     * Start a composite clause chain
     */
    compose(): CompositeBuilder<T> {
        return new CompositeBuilder<T>();
    }
    /**
     * Build the final clause
     */
    build(): Clause {
        if (Object.keys(this.clause).length === 0) {
            throw new Error("You cannot build an empty Clause");
        }

        return this.clause;
    }
}

class CompositeBuilder<T extends Record<string, Record<string, any>>> {
    private orClauses: Clause[] = [];
    private andClauses: Clause[] = [];

    or(clauses: ClauseBuilderInterface[]): CompositeBuilder<T> {
        this.orClauses = clauses.map((c) => c.build());
        return this;
    }

    and(clauses: ClauseBuilderInterface[]): CompositeBuilder<T> {
        this.andClauses = clauses.map((c) => c.build());
        return this;
    }

    build(): Clause {
        if (this.orClauses.length === 0 && this.andClauses.length === 0) {
            throw new Error(
                "ComposeClause is empty. Add .or([clause]) or .and([clause])"
            );
        }

        // If we only have OR clauses
        if (this.orClauses && this.andClauses.length === 0) {
            return {
                Composite: {
                    operator: "Or",
                    clauses: this.orClauses,
                },
            };
        }

        // If we only have AND clauses
        if (this.andClauses && this.orClauses.length === 0) {
            return {
                Composite: {
                    operator: "And",
                    clauses: this.andClauses,
                },
            };
        }

        // If we have both OR and AND clauses
        if (this.andClauses && this.orClauses) {
            return {
                Composite: {
                    operator: "And",
                    clauses: [
                        ...this.andClauses,
                        {
                            Composite: {
                                operator: "Or",
                                clauses: this.orClauses,
                            },
                        },
                    ],
                },
            };
        }

        throw new Error("CompositeClause is not properly build");
    }
}
