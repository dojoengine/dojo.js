import {
    Clause,
    ComparisonOperator,
    MemberValue,
    PatternMatching,
} from "@dojoengine/torii-client";

import { convertToPrimitive } from "./convertToMemberValue";
import { SchemaType } from "./types";

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
    Path extends string,
> = Path extends `${infer Namespace}-${infer Model}`
    ? Namespace extends keyof T
        ? Model extends keyof T[Namespace]
            ? T[Namespace][Model]
            : never
        : never
    : never;

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
        pattern: PatternMatching = "FixedLen"
    ): ClauseBuilder<T> {
        this.clause = {
            Keys: {
                keys,
                pattern_matching: pattern,
                models,
            },
        };
        return this;
    }

    /**
     * Create a member clause for comparing values
     */
    where<
        Path extends ModelPath<T, keyof T>,
        M extends keyof GetModelType<T, Path>,
    >(
        model: Path,
        member: M & string,
        operator: ComparisonOperator,
        value: GetModelType<T, Path>[M] | GetModelType<T, Path>[M][]
    ): ClauseBuilder<T> {
        const memberValue: MemberValue = Array.isArray(value)
            ? { List: value.map(convertToPrimitive) }
            : convertToPrimitive(value);

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

    or(clauses: ClauseBuilder<T>[]): CompositeBuilder<T> {
        this.orClauses = clauses.map((c) => c.build());
        return this;
    }

    and(clauses: ClauseBuilder<T>[]): CompositeBuilder<T> {
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
