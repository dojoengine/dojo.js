import { AccountInterface, Contract } from "starknet";

type AbiType =
    | "felt"
    | "felt*"
    | "core::integer::u8"
    | "core::integer::u16"
    | "core::integer::u32"
    | "core::integer::u64"
    | "core::integer::u128"
    | "core::integer::u256"
    | "core::bool"
    | "core::array::Array<felt>"
    | "core::array::Array<u256>"
    | string; // For custom types

interface TypeMapping {
    felt: string;
    "felt*": string[];
    "core::integer::u8": number;
    "core::integer::u16": number;
    "core::integer::u32": number;
    "core::integer::u64": number;
    "core::integer::u128": bigint;
    "core::integer::u256": bigint;
    "core::bool": boolean;
    "core::array::Array<felt>": string[];
    "core::array::Array<u256>": bigint[];
    // Add custom type mappings here
    "dojo_starter::models::Direction": "Left" | "Right" | "Up" | "Down";
}

type MapAbiType<T extends AbiType> = T extends keyof TypeMapping
    ? TypeMapping[T]
    : unknown; // Default to unknown for unmapped types

type InputDefinition = { name: string; type: AbiType };
type OutputDefinition = { type: AbiType };

type InputsType = ReadonlyArray<InputDefinition>;
type OutputsType = ReadonlyArray<OutputDefinition>;

interface FunctionAbi {
    type: "function";
    name: string;
    inputs: InputsType;
    outputs: OutputsType;
    state_mutability?: string;
}

interface InterfaceAbi {
    type: "interface";
    name: string;
    items: FunctionAbi[];
}

type AbiItem = FunctionAbi | InterfaceAbi | { type: string };

export interface ContractDefinition {
    kind: string;
    address: string;
    abi: readonly AbiItem[];
    systems?: readonly string[];
    tag: string;
}

type MapInputType<T extends InputsType> = {
    [K in T[number] as K["name"]]: MapAbiType<K["type"]>;
};

type MapOutputType<T extends OutputsType> = T extends []
    ? void
    : T["length"] extends 1
      ? MapAbiType<T[0]["type"]>
      : { [K in keyof T]: MapAbiType<T[K]["type"]> };

type ContractFunctions<T extends readonly FunctionAbi[]> = {
    [F in T[number] as F["name"]]: (
        args: MapInputType<F["inputs"]>
    ) => Promise<MapOutputType<F["outputs"]>>;
};

export type WorldContracts<T extends readonly ContractDefinition[]> = {
    [K in T[number]["tag"]]: ContractFunctions<
        Extract<T[number], { tag: K }>["abi"] extends readonly (infer U)[]
            ? U extends FunctionAbi
                ? readonly U[]
                : never
            : never
    >;
};

export function createWorldProxy<T extends readonly ContractDefinition[]>(
    contractDefinitions: T,
    providerOrAccount: AccountInterface
): WorldContracts<T> {
    const proxy = {} as WorldContracts<T>;

    contractDefinitions.forEach((contractDef) => {
        type Tag = typeof contractDef.tag;
        type ContractDef = Extract<T[number], { tag: Tag }>;
        type AbiItems = ContractDef["abi"];
        type FunctionAbis = AbiItems extends readonly (infer U)[]
            ? U extends FunctionAbi
                ? readonly U[]
                : never
            : never;
        type Functions = ContractFunctions<FunctionAbis>;

        const contract = new Contract(
            contractDef.abi as AbiItem[],
            contractDef.address,
            providerOrAccount
        );

        const functions = {} as Functions;

        const functionAbis = contractDef.abi.filter(
            (item): item is FunctionAbi => item.type === "function"
        ) as unknown as FunctionAbis;

        (functionAbis as readonly FunctionAbi[]).forEach((functionAbi) => {
            const func = async (
                args: MapInputType<typeof functionAbi.inputs>
            ): Promise<MapOutputType<typeof functionAbi.outputs>> => {
                const inputs = functionAbi.inputs.map(
                    (input) => args[input.name]
                ) as any[];
                const result = await (contract.functions as any)[
                    functionAbi.name
                ](...inputs);
                return result as MapOutputType<typeof functionAbi.outputs>;
            };

            functions[functionAbi.name as keyof Functions] = func as any;
        });

        proxy[contractDef.tag as keyof WorldContracts<T>] = functions;
    });

    return proxy;
}
// // Example usage
// const contractDefinitions = [
//     {
//         kind: "DojoContract",
//         address:
//             "0x25d128c5fe89696e7e15390ea58927bbed4290ae46b538b28cfc7c2190e378b",
//         abi: [
//             {
//                 type: "function",
//                 name: "spawn",
//                 inputs: [],
//                 outputs: [],
//                 state_mutability: "external",
//             },
//             {
//                 type: "function",
//                 name: "move",
//                 inputs: [
//                     {
//                         name: "direction",
//                         type: "dojo_starter::models::Direction",
//                     },
//                 ],
//                 outputs: [],
//                 state_mutability: "external",
//             },
//         ] as const,
//         systems: ["spawn", "move"] as const,
//         tag: "actions",
//     },
// ] as const;

// // Assuming you have a provider or account set up
// const providerOrAccount: AccountInterface = {} as any; // replace with actual provider or account

// const world = createWorldProxy(contractDefinitions, providerOrAccount);

// // Usage example
// async function useWorld() {
//     await world.actions.spawn({});
//     await world.actions.move({ direction: "Left" });

//     // TypeScript will catch these errors:
//     // @ts-expect-error
//     await world.actions.nonexistentMethod();
//     // @ts-expect-error
//     await world.nonexistentContract.someMethod();
// }
