import { describe, expect, it } from "vitest";
import { intoEntityKeysClause } from "../convertClauseToEntityKeysClause";
import { ClauseBuilder } from "../../clauseBuilder";

describe("convertClauseToEntityKeysClause", () => {
    it("return empty array", () => {
        expect(intoEntityKeysClause(undefined)).toEqual([]);
    });

    it("returns Keys if KeysClause", () => {
        const clause = new ClauseBuilder().keys([], []).build();
        expect(intoEntityKeysClause(clause)).toEqual([
            {
                Keys: {
                    keys: [undefined],
                    pattern_matching: "VariableLen",
                    models: [],
                },
            },
        ]);
    });

    it("HashedKeys has priority over keys", () => {
        const clause = new ClauseBuilder()
            .keys(["dojo_starter-Position"], ["0x123"])
            .build();
        expect(
            intoEntityKeysClause(clause, [
                {
                    entityId: "0xentityHashedKey",
                    models: { dojo_starter: { Position: { some: "data" } } },
                },
            ])
        ).toEqual([
            {
                HashedKeys: ["0xentityHashedKey"],
            },
        ]);
    });

    it("CompositeClauses cannot be converted to EntityKeysClause", () => {
        const clause = new ClauseBuilder()
            .compose()
            .or([
                new ClauseBuilder().keys(["dojo_starter-Position"], ["0x123"]),
                new ClauseBuilder().keys(["dojo_starter-Position"], ["0x456"]),
            ])
            .build();

        expect(() => intoEntityKeysClause(clause, [])).toThrowError(
            /cannot use CompositeClause \| MemberClause/
        );
    });

    it("MemberClause cannot be converted to EntityKeysClause", () => {
        const clause = new ClauseBuilder()
            .where("dojo_starter-Position", "x", "Gt", 5)
            .build();

        expect(() => intoEntityKeysClause(clause, [])).toThrowError(
            /cannot use CompositeClause \| MemberClause/
        );
    });
});
