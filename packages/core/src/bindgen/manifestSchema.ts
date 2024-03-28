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

const fullContract = z.object({
    name: z.string(),
    address: z.string(),
    class_hash: z.string(),
    abi: z.array(abiItem),
    reads: z.array(z.unknown()),
    writes: z.array(z.unknown()),
    computed: z.array(z.unknown()),
});

const model = z.object({
    name: z.string(),
    members: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
            key: z.boolean(),
        })
    ),
    class_hash: z.string(),
    abi: z.array(abiItem),
});

const manifestSchema = z.object({
    world: fullContract,
    executor: fullContract.extend({ address: z.string().nullable() }),
    base: fullContract.pick({ name: true, class_hash: true, abi: true }),
    contracts: z.array(fullContract),
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
