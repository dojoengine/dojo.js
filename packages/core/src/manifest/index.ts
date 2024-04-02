import { z } from "zod";

const abiItem = z.union([
    z.object({
        type: z.literal("impl"),
        name: z.string(),
        interface_name: z.string(),
    }),
    z.object({
        type: z.literal("struct"),
        name: z.string(),
        members: z.array(z.object({ name: z.string(), type: z.string() })),
    }),
    z.object({
        type: z.literal("enum"),
        name: z.string(),
        variants: z.array(z.object({ name: z.string(), type: z.string() })),
    }),
    z.object({
        type: z.literal("interface"),
        name: z.string(),
        items: z.array(
            z.object({
                type: z.literal("function"),
                name: z.string(),
                inputs: z.array(
                    z.object({ name: z.string(), type: z.string() })
                ),
                outputs: z.array(z.object({ type: z.string() })),
                state_mutability: z.string(),
            })
        ),
    }),
    z.object({
        type: z.literal("constructor"),
        name: z.string(),
        inputs: z.array(z.object({ name: z.string(), type: z.string() })),
    }),
    z.object({
        type: z.literal("event"),
        name: z.string(),
        kind: z.literal("struct"),
        members: z.array(
            z.object({ name: z.string(), type: z.string(), kind: z.string() })
        ),
    }),
    z.object({
        type: z.literal("event"),
        name: z.string(),
        kind: z.literal("enum"),
        variants: z.array(
            z.object({ name: z.string(), type: z.string(), kind: z.string() })
        ),
    }),
]);

const generalFields = z.object({
    kind: z.string(),
    class_hash: z.string(),
    name: z.string(),
    abi: z.array(abiItem),
});

const world = generalFields.extend({
    address: z.string(),
    transaction_hash: z.string(),
    block_number: z.number(),
    seed: z.string(),
});

const contract = generalFields.extend({
    address: z.string(),
    reads: z.array(z.unknown()),
    writes: z.array(z.unknown()),
    computed: z.array(z.unknown()),
});

const model = generalFields.extend({
    members: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
            key: z.boolean(),
        })
    ),
});

const manifestSchema = z.object({
    world: world,
    base: generalFields,
    contracts: z.array(contract),
    models: z.array(model),
});

export type Manifest = z.infer<typeof manifestSchema>;

export const createManifestFromJson = (content: any): Manifest => {
    try {
        return manifestSchema.parse(content);
    } catch (error) {
        console.error(error);
        throw new Error("Invalid Dojo manifest.json");
    }
};
