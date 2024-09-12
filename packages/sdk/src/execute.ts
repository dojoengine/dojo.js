import { Contract, AccountInterface } from "starknet";

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

type InputsType = ReadonlyArray<{ name: string; type: AbiType }>;
type OutputsType = ReadonlyArray<{ type: AbiType }>;

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

type MapAbiType<T extends AbiType> = T extends "felt"
    ? string
    : T extends "felt*"
      ? string[]
      : T extends
              | "core::integer::u8"
              | "core::integer::u16"
              | "core::integer::u32"
              | "core::integer::u64"
        ? number
        : T extends "core::integer::u128" | "core::integer::u256"
          ? bigint
          : T extends "core::bool"
            ? boolean
            : T extends "core::array::Array<felt>"
              ? string[]
              : T extends "core::array::Array<u256>"
                ? bigint[]
                : string; // Default case for custom types

type MapInputType<T extends InputsType> = {
    [K in T[number] as K["name"]]: MapAbiType<K["type"]>;
};

type MapOutputType<T extends OutputsType> = T["length"] extends 0
    ? void
    : T["length"] extends 1
      ? MapAbiType<T[0]["type"]>
      : { [K in keyof T]: MapAbiType<T[K]["type"]> };

type ExtractFunctions<T extends readonly AbiItem[]> = Extract<
    T[number],
    FunctionAbi
>;

type ContractFunctions<T extends readonly AbiItem[]> = {
    [K in ExtractFunctions<T>["name"]]: (
        args: MapInputType<Extract<ExtractFunctions<T>, { name: K }>["inputs"]>
    ) => Promise<
        MapOutputType<Extract<ExtractFunctions<T>, { name: K }>["outputs"]>
    >;
};

export type WorldContracts<T extends readonly ContractDefinition[]> = {
    [K in T[number]["tag"]]: ContractFunctions<T[number]["abi"]>;
};

export function createWorldProxy<T extends readonly ContractDefinition[]>(
    contractDefinitions: T,
    providerOrAccount: AccountInterface
): WorldContracts<T> {
    const proxy = {} as WorldContracts<T>;

    for (const contractDef of contractDefinitions) {
        const contract = new Contract(
            contractDef.abi as AbiItem[],
            contractDef.address,
            providerOrAccount
        );

        (proxy as any)[contractDef.tag] = new Proxy(
            {} as ContractFunctions<typeof contractDef.abi>,
            {
                get: (target, prop: string) => {
                    if (prop in contract.functions) {
                        return async (args: any) => {
                            const functionAbi = contractDef.abi.find(
                                (item) =>
                                    item.type === "function" &&
                                    "name" in item &&
                                    item.name === prop
                            ) as FunctionAbi;
                            const inputs = functionAbi.inputs.map(
                                (input) => args[input.name]
                            );
                            return await contract.functions[prop](...inputs);
                        };
                    }
                    return undefined;
                },
            }
        );
    }

    return proxy;
}

// Example usage
const contractDefinitions = [
    {
        kind: "DojoContract",
        address:
            "0x25d128c5fe89696e7e15390ea58927bbed4290ae46b538b28cfc7c2190e378b",
        abi: [
            {
                type: "function",
                name: "spawn",
                inputs: [],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "move",
                inputs: [
                    {
                        name: "direction",
                        type: "dojo_starter::models::Direction",
                    },
                ],
                outputs: [],
                state_mutability: "external",
            },
        ],
        systems: ["spawn", "move"],
        tag: "actions",
    },
] as const;

// Assuming you have a provider or account set up
const providerOrAccount: AccountInterface = {} as any; // replace with actual provider or account

const world = createWorldProxy(contractDefinitions, providerOrAccount);

// Usage example
async function useWorld() {
    await world.actions.spawn({});
    await world.actions.move({ direction: "Left" });

    // TypeScript will catch these errors:
    // @ts-expect-error
    await world.actions.nonexistentMethod();
    // @ts-expect-error
    await world.nonexistentContract.someMethod();
}
