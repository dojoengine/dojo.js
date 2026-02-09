import { Calldata, CairoCustomEnum, CairoOption, RawArgs } from "starknet";

/**
 * Enumeration representing various entry points or functions available in the World.
 */
export enum WorldEntryPoints {
    get = "entity", // Retrieve a single entity
    set = "set_entity", // Set or update a single entity
    entities = "entities", // Retrieve multiple entities
    execute = "execute", // Execute a specific command
    registerSystem = "register_system", // Register a new system
    registerComponent = "register_model", // Register a new component
    model = "model", // Access a component
    system = "system", // Access a system
    metadataUri = "metadata_uri", // Retrieve metadata URI for a resource
    setMetadataUri = "set_metadata_uri", // Set metadata URI for a resource
    registerModel = "register_model", // Register a new model
    deployContract = "deploy_contract", // Deploy a contract and return its address
    upgradeContract = "upgrade_contract", // Upgrade a contract
    uuid = "uuid", // Retrieve the UUID of the world
    emit = "emit", // Emit an event
    entityIds = "entity_ids", // Retrieve entity IDs for a model
    setExecutor = "set_executor", // Set executor for the world
    executor = "executor", // Retrieve the executor's address
    base = "base", // Retrieve base class hash
    deleteEntity = "delete_entity", // Delete an entity
    isOwner = "is_owner", // Check if an address is an owner of a resource
    grantOwner = "grant_owner", // Grant ownership of a resource
    revokeOwner = "revoke_owner", // Revoke ownership of a resource
    isWriter = "is_writer", // Check if a system is a writer for a model
    grantWriter = "grant_writer", // Grant writer permission
    revokeWriter = "revoke_writer", // Revoke writer permission
}

/**
 * World interface: An interface that defines the methods that a world must implement.
 * Dojo v0.4.0
 */

export interface IWorld {
    // Retrieve metadata URI for a resource
    metadataUri?(resource: string): Promise<Array<string>>;

    // Set metadata URI for a resource
    setMetadataUri?(resource: string, uri: Array<string>): Promise<void>;

    // Retrieve model class hash by name
    model?(name: string): Promise<string>;

    // Register a new model
    registerModel?(classHash: string): Promise<void>;

    // Deploy a contract and return its address
    deployContract?(salt: string, classHash: string): Promise<string>;

    // Upgrade a contract and return its new class hash
    upgradeContract?(address: string, classHash: string): Promise<string>;

    // Retrieve the UUID of the world
    uuid?(): Promise<string>;

    // Retrieve entity details
    entity?(
        model: string,
        keys: Array<string>,
        offset: number,
        length: number,
        layout: Array<number>
    ): Promise<Array<bigint>>;

    // Set entity details
    setEntity?(
        model: string,
        keys: Array<string>,
        offset: number,
        values: Array<string>,
        layout: Array<number>
    ): Promise<void>;

    // Retrieve multiple entities' details
    entities?(
        model: string,
        index: string | null,
        values: Array<string>,
        valuesLength: number,
        valuesLayout: Array<number>
    ): Promise<Array<Array<bigint>>>;

    // Retrieve entity IDs for a model
    entityIds?(model: string): Promise<Array<string>>;

    // Set executor for the world
    setExecutor?(contractAddress: string): Promise<void>;

    // Retrieve the executor's address
    executor?(): Promise<string>;

    // Retrieve base class hash
    base?(): Promise<string>;

    // Delete an entity
    deleteEntity?(
        model: string,
        keys: Array<string>,
        layout: Array<number>
    ): Promise<void>;

    // Check if an address is an owner of a resource
    isOwner?(address: string, resource: string): Promise<boolean>;

    // Grant ownership of a resource to an address
    grantOwner?(address: string, resource: string): Promise<void>;

    // Revoke ownership of a resource from an address
    revokeOwner?(address: string, resource: string): Promise<void>;

    // Check if a system is a writer for a model
    isWriter?(model: string, system: string): Promise<boolean>;

    // Grant writer permission to a system for a model
    grantWriter?(model: string, system: string): Promise<void>;

    // Revoke writer permission from a system for a model
    revokeWriter?(model: string, system: string): Promise<void>;

    // Get the age or duration since the World was created
    worldAge?(): Promise<bigint>;
}

export type DojoCall = {
    contractName: string;
    entrypoint: string;
    calldata: RawArgs | Calldata;
};

/**
 * Minimal manifest shape consumed by DojoProvider and utility functions.
 * Supports both legacy (inline ABI) and modern (root-level abis) formats.
 */
export interface DojoManifest {
    world: {
        address: string;
        abi?: readonly Record<string, unknown>[];
    };
    /** Root-level ABI array (modern format). */
    abis?: readonly Record<string, unknown>[];
    contracts?: ReadonlyArray<{
        tag: string;
        address: string;
        systems?: readonly string[];
        abi?: readonly Record<string, unknown>[];
    }>;
    [key: string]: unknown;
}

/**
 * Cairo to TypeScript type mappings
 */
type CairoToTsTypeMap = {
    "core::felt252": string;
    "core::integer::u8": number;
    "core::integer::u16": number;
    "core::integer::u32": number;
    "core::integer::u64": bigint;
    "core::integer::u128": bigint;
    "core::integer::u256": bigint;
    "core::integer::i8": number;
    "core::integer::i16": number;
    "core::integer::i32": number;
    "core::integer::i64": bigint;
    "core::integer::i128": bigint;
    "core::bool": boolean;
    "core::starknet::contract_address::ContractAddress": string;
    "core::starknet::class_hash::ClassHash": string;
    "core::byte_array::ByteArray": string;
    "()": void;
};

/**
 * Map Cairo type to TypeScript type with ABI context
 */
export type MapCairoType<
    T extends string,
    ABI extends readonly any[] = never,
> = T extends keyof CairoToTsTypeMap
    ? CairoToTsTypeMap[T]
    : T extends `core::array::Array::<${infer Inner}>`
      ? MapCairoType<Inner, ABI>[]
      : T extends `core::array::Span::<${infer Inner}>`
        ? MapCairoType<Inner, ABI>[]
        : T extends `@core::array::Array::<${infer Inner}>`
          ? MapCairoType<Inner, ABI>[]
          : T extends `(${infer Types})`
            ? MapTupleTypes<Types, ABI>
            : ABI extends never
              ? unknown
              : T extends ExtractStructNames<ABI>
                ? ExtractStructType<T, ABI>
                : T extends ExtractEnumNames<ABI>
                  ? ExtractEnumType<T, ABI>
                  : unknown;

/**
 * Extract all struct names from ABI
 */
type ExtractStructNames<ABI extends readonly any[]> = Extract<
    ABI[number],
    { type: "struct"; name: string }
>["name"];

/**
 * Find the first struct with a specific name in the ABI
 * This prevents duplicate struct definitions from creating union types
 */
type FindFirstStructByName<
    ABI extends readonly any[],
    Name extends string,
> = ABI extends readonly [infer First, ...infer Rest extends readonly any[]]
    ? First extends { type: "struct"; name: Name }
        ? First
        : FindFirstStructByName<Rest, Name>
    : never;

/**
 * Extract a specific struct type by name from ABI
 * Only uses the first occurrence of a struct with the given name
 */
type ExtractStructType<
    Name extends string,
    ABI extends readonly any[],
> = FindFirstStructByName<ABI, Name> extends {
    type: "struct";
    name: Name;
    members: infer M;
}
    ? M extends readonly { name: string; type: string }[]
        ? {
              [P in M[number] as P["name"]]: MapCairoType<P["type"], ABI>;
          }
        : never
    : never;

/**
 * Map tuple types
 */
type MapTupleTypes<
    T extends string,
    ABI extends readonly any[] = never,
> = T extends `${infer First}, ${infer Rest}`
    ? [MapCairoType<First, ABI>, ...MapTupleTypes<Rest, ABI>]
    : T extends ""
      ? []
      : [MapCairoType<T, ABI>];

type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

type UnionToIntersection<U> = (
    U extends any
        ? (arg: U) => void
        : never
) extends (arg: infer I) => void
    ? I
    : never;

// ========================
// ABI Type Extraction
// ========================

/**
 * Extract function signature from a function item
 */
type ExtractFunctionSignature<
    F,
    ABI extends readonly any[] = never,
> = F extends {
    type: "function";
    name: string;
    inputs: infer I;
    outputs: infer O;
}
    ? {
          inputs: I extends readonly {
              name: string;
              type: string;
          }[]
              ? {
                    [P in I[number] as P["name"]]: MapCairoType<P["type"], ABI>;
                }
              : never;
          outputs: O extends readonly { type: string }[]
              ? O["length"] extends 0
                  ? void
                  : O["length"] extends 1
                    ? MapCairoType<O[0]["type"], ABI>
                    : {
                          [Index in keyof O]: O[Index] extends {
                              type: string;
                          }
                              ? MapCairoType<O[Index]["type"], ABI>
                              : never;
                      }
              : void;
          stateMutability: F extends { state_mutability: infer Mut }
              ? Mut extends string
                  ? Mut
                  : "external"
              : "external";
      }
    : never;

/**
 * Extract all types from ABI array
 */
export type ExtractAbiTypesFromArray<ABI> = ABI extends readonly any[]
    ? {
          structs: ExtractStructs<ABI>;
          enums: ExtractEnums<ABI>;
          functions: ExtractFunctions<ABI>;
          interfaces: ExtractInterfaces<ABI>;
          models: ExtractModels<ABI>;
          actions: ExtractActions<ABI, ExtractInterfaces<ABI>>;
      }
    : never;

/**
 * Helper type to extract structs from ABI
 */
type ExtractStructs<ABI extends readonly any[]> = {
    [StructName in ExtractStructNames<ABI>]: ExtractStructType<StructName, ABI>;
};

/**
 * Find the first enum with a specific name in the ABI
 * This prevents duplicate enum definitions from creating union types
 */
type FindFirstEnumByName<
    ABI extends readonly any[],
    Name extends string,
> = ABI extends readonly [infer First, ...infer Rest extends readonly any[]]
    ? First extends { type: "enum"; name: Name }
        ? First
        : FindFirstEnumByName<Rest, Name>
    : never;

/**
 * Extract all enum names from ABI
 */
type ExtractEnumNames<ABI extends readonly any[]> = Extract<
    ABI[number],
    { type: "enum"; name: string }
>["name"];

type CairoEnumVariantMap<
    Variants extends readonly { name: string; type: string }[],
    ABI extends readonly any[],
> = {
    [P in Variants[number] as P["name"]]: MapCairoType<P["type"], ABI>;
};

type ExtractEnumVariants<
    Name extends string,
    ABI extends readonly any[],
> = FindFirstEnumByName<ABI, Name> extends {
    type: "enum";
    name: Name;
    variants: infer V;
}
    ? V extends readonly { name: string; type: string }[]
        ? CairoEnumVariantMap<V, ABI>
        : never
    : never;

/**
 * Extract just the type union of an enum by name
 * This is used for type mapping in function parameters
 */
type ExtractEnumType<
    Name extends string,
    ABI extends readonly any[],
> = ExtractEnumVariants<Name, ABI> extends infer VariantMap
    ? [VariantMap] extends [never]
        ? never
        : Name extends `core::option::Option::<${infer Inner}>`
          ? CairoOption<MapCairoType<Inner, ABI>>
          : CairoCustomEnum & {
                readonly __variantMap?: VariantMap;
                readonly __variantNames?: keyof VariantMap & string;
            }
    : never;

/**
 * Helper type to extract enums from ABI
 */
type ExtractEnums<ABI extends readonly any[]> = {
    [EnumName in ExtractEnumNames<ABI>]: FindFirstEnumByName<
        ABI,
        EnumName
    > extends {
        type: "enum";
        name: EnumName;
        variants: infer V;
    }
        ? V extends readonly { name: string; type: string }[]
            ? {
                  variants: CairoEnumVariantMap<V, ABI>;
                  type: ExtractEnumType<EnumName, ABI>;
                  variantNames: V[number]["name"];
              }
            : never
        : never;
};

/**
 * Find the first function with a specific name in the ABI
 * This prevents duplicate function definitions from creating union types
 */
type FindFirstFunctionByName<
    ABI extends readonly any[],
    Name extends string,
> = ABI extends readonly [infer First, ...infer Rest extends readonly any[]]
    ? First extends { type: "function"; name: Name }
        ? First
        : FindFirstFunctionByName<Rest, Name>
    : never;

/**
 * Extract all function names from ABI
 */
type ExtractFunctionNames<ABI extends readonly any[]> = Extract<
    ABI[number],
    { type: "function"; name: string }
>["name"];

/**
 * Helper type to extract functions from ABI
 */
type ExtractFunctions<ABI extends readonly any[]> = {
    [FunctionName in ExtractFunctionNames<ABI>]: ExtractFunctionSignature<
        FindFirstFunctionByName<ABI, FunctionName>,
        ABI
    >;
};

/**
 * Find the first interface with a specific name in the ABI
 * This prevents duplicate interface definitions from creating union types
 */
type FindFirstInterfaceByName<
    ABI extends readonly any[],
    Name extends string,
> = ABI extends readonly [infer First, ...infer Rest extends readonly any[]]
    ? First extends { type: "interface"; name: Name }
        ? First
        : FindFirstInterfaceByName<Rest, Name>
    : never;

/**
 * Extract all interface names from ABI
 */
type ExtractInterfaceNames<ABI extends readonly any[]> = Extract<
    ABI[number],
    { type: "interface"; name: string }
>["name"];

/**
 * Helper type to extract interfaces from ABI
 */
type ExtractInterfaces<ABI extends readonly any[]> = {
    [InterfaceName in ExtractInterfaceNames<ABI>]: FindFirstInterfaceByName<
        ABI,
        InterfaceName
    > extends {
        type: "interface";
        name: InterfaceName;
        items: infer Items;
    }
        ? Items extends readonly any[]
            ? {
                  [F in Items[number] as F extends {
                      type: "function";
                      name: infer FN;
                  }
                      ? FN extends string
                          ? FN
                          : never
                      : never]: ExtractFunctionSignature<F, ABI>;
              }
            : {}
        : never;
};

type ModelStructNames<ABI extends readonly any[]> = Extract<
    ExtractStructNames<ABI>,
    `${string}::models::${string}`
>;

type MergeModelEntries<ABI extends readonly any[]> = UnionToIntersection<
    ModelStructNames<ABI> extends infer Name
        ? Name extends `${infer Namespace}::models::${infer Model}`
            ? {
                  [K in Namespace]: {
                      [P in Model]: ExtractStructType<Name, ABI>;
                  };
              }
            : {}
        : {}
>;

type ExtractModels<ABI extends readonly any[]> = Simplify<
    MergeModelEntries<ABI>
>;

type ActionInterfaceNames<ABI extends readonly any[]> = Extract<
    ExtractInterfaceNames<ABI>,
    `${string}::systems::actions::${string}`
>;

type MergeActionEntries<
    ABI extends readonly any[],
    Interfaces extends Record<string, any>,
> = UnionToIntersection<
    ActionInterfaceNames<ABI> extends infer Name
        ? Name extends `${infer Namespace}::systems::actions::${infer Interface}`
            ? {
                  [K in Namespace]: {
                      [P in Interface]: Interfaces[Name & keyof Interfaces];
                  };
              }
            : {}
        : {}
>;

type ExtractActions<
    ABI extends readonly any[],
    Interfaces extends Record<string, any>,
> = Simplify<MergeActionEntries<ABI, Interfaces>>;

/**
 * Main exported type for extracting ABI types
 * Usage:
 * - Compiled ABI: type MyAbi = ExtractAbiTypes<typeof compiledAbi>
 * - Raw ABI array: type MyAbi = ExtractAbiTypes<typeof abi>
 */
export type ExtractAbiTypes<T> = T extends { abi: infer ABI }
    ? ABI extends readonly any[]
        ? ExtractAbiTypesFromArray<ABI>
        : never
    : T extends readonly any[]
      ? ExtractAbiTypesFromArray<T>
      : never;

type ModelCollection<T> = ExtractAbiTypes<T>["models"];

type ActionCollection<T> = ExtractAbiTypes<T>["actions"];

export type ModelsFromAbi<T> = ModelCollection<T>;

export type ActionsFromAbi<T> = ActionCollection<T>;

type ModelPathUnion<Models> = Models extends Record<string, Record<string, any>>
    ? {
          [Namespace in keyof Models & string]: {
              [Model in keyof Models[Namespace] &
                  string]: `${Namespace}-${Model}`;
          }[keyof Models[Namespace] & string];
      }[keyof Models & string]
    : never;

export type ModelPathFromAbi<T> = ModelPathUnion<ModelCollection<T>>;

export type GetModel<
    T,
    Path extends ModelPathFromAbi<T>,
> = ModelCollection<T> extends Record<string, Record<string, any>>
    ? Path extends `${infer Namespace}-${infer Model}`
        ? Namespace extends keyof ModelCollection<T>
            ? Model extends keyof ModelCollection<T>[Namespace]
                ? ModelCollection<T>[Namespace][Model]
                : never
            : never
        : never
    : never;

export type GetActions<
    T,
    Namespace extends keyof ActionCollection<T>,
> = ActionCollection<T>[Namespace];

export type GetActionInterface<
    T,
    Namespace extends keyof ActionCollection<T>,
    InterfaceName extends keyof ActionCollection<T>[Namespace],
> = ActionCollection<T>[Namespace][InterfaceName];

export type GetActionFunction<
    T,
    Namespace extends keyof ActionCollection<T>,
    InterfaceName extends keyof ActionCollection<T>[Namespace],
    FunctionName extends keyof ActionCollection<T>[Namespace][InterfaceName],
> = ActionCollection<T>[Namespace][InterfaceName][FunctionName];
