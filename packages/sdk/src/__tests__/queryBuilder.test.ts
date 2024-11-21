import { describe, expect, it } from "vitest";
import { QueryBuilder } from "../queryBuilder";
import { MockSchemaType } from "../__example__/index";

describe("QueryBuilder", () => {
    it("should be implemented", () => {
        const query = new QueryBuilder().build();
        expect(query).toStrictEqual({});
    });

    it("should work with example", () => {
        const query = new QueryBuilder<MockSchemaType>()
            .namespace("world", (n) =>
                n.entity("player", (e) => e.eq("id", "1").eq("name", "Alice"))
            )
            .namespace("universe", (n) =>
                n.entity("galaxy", (e) => e.is("name", "Milky Way"))
            )
            .build();
        const expected = {
            world: {
                player: {
                    $: { where: { id: { $eq: "1" }, name: { $eq: "Alice" } } },
                },
            },
            universe: {
                galaxy: {
                    $: {
                        where: { name: { $is: "Milky Way" } },
                    },
                },
            },
        };

        expect(query).toStrictEqual(expected);
    });
});
