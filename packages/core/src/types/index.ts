import { Calldata, RawArgs } from "starknet";

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
 * Map Cairo type to TypeScript type
 */
export type MapCairoType<T extends string> = T extends keyof CairoToTsTypeMap
    ? CairoToTsTypeMap[T]
    : T extends `core::array::Array::<${infer Inner}>`
      ? MapCairoType<Inner>[]
      : T extends `core::array::Span::<${infer Inner}>`
        ? MapCairoType<Inner>[]
        : T extends `@core::array::Array::<${infer Inner}>`
          ? MapCairoType<Inner>[]
          : T extends `(${infer Types})`
            ? MapTupleTypes<Types>
            : unknown;

/**
 * Map tuple types
 */
type MapTupleTypes<T extends string> = T extends `${infer First}, ${infer Rest}`
    ? [MapCairoType<First>, ...MapTupleTypes<Rest>]
    : T extends ""
      ? []
      : [MapCairoType<T>];

/**
 * Extract all types from ABI array
 */
export type ExtractAbiTypesFromArray<ABI> = ABI extends readonly any[]
    ? {
          structs: {
              [K in ABI[number] as K extends { type: "struct"; name: infer N }
                  ? N extends string
                      ? N
                      : never
                  : never]: K extends {
                  type: "struct";
                  name: string;
                  members: infer M;
              }
                  ? M extends readonly { name: string; type: string }[]
                      ? {
                            [P in M[number] as P["name"]]: MapCairoType<
                                P["type"]
                            >;
                        }
                      : never
                  : never;
          };
          enums: {
              [K in ABI[number] as K extends { type: "enum"; name: infer N }
                  ? N extends string
                      ? N
                      : never
                  : never]: K extends {
                  type: "enum";
                  name: string;
                  variants: infer V;
              }
                  ? V extends readonly { name: string; type: string }[]
                      ? {
                            [P in V[number] as P["name"]]: MapCairoType<
                                P["type"]
                            >;
                        }[V[number]["name"]]
                      : never
                  : never;
          };
          functions: {
              [K in ABI[number] as K extends {
                  type: "function";
                  name: infer N;
              }
                  ? N extends string
                      ? N
                      : never
                  : never]: K extends {
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
                                  [P in I[number] as P["name"]]: MapCairoType<
                                      P["type"]
                                  >;
                              }
                            : never;
                        outputs: O extends readonly { type: string }[]
                            ? O["length"] extends 0
                                ? void
                                : O["length"] extends 1
                                  ? MapCairoType<O[0]["type"]>
                                  : {
                                        [Index in keyof O]: O[Index] extends {
                                            type: string;
                                        }
                                            ? MapCairoType<O[Index]["type"]>
                                            : never;
                                    }
                            : void;
                    }
                  : never;
          };
      }
    : never;

/**
 * Extract contract types from manifest
 */
type ExtractContractTypes<Contract> = Contract extends {
    tag: string;
    abi: infer ABI;
}
    ? {
          abi: ExtractAbiTypesFromArray<ABI>;
          tag: Contract["tag"];
          address: Contract extends { address: string }
              ? Contract["address"]
              : never;
      }
    : never;

/**
 * Extract model type from manifest
 */
type ExtractModelType<Model> = Model extends {
    tag: string;
    selector: string;
    members?: infer Members;
}
    ? {
          tag: Model["tag"];
          selector: Model["selector"];
          fields: Members extends readonly { name: string; type: string }[]
              ? {
                    [K in Members[number] as K["name"]]: MapCairoType<
                        K["type"]
                    >;
                }
              : {};
      }
    : never;

/**
 * Extract event type from manifest
 */
type ExtractEventType<Event> = Event extends {
    tag: string;
    selector: string;
    members?: infer Members;
}
    ? {
          tag: Event["tag"];
          selector: Event["selector"];
          data: Members extends readonly {
              name: string;
              type: string;
              kind: string;
          }[]
              ? {
                    [K in Members[number] as K["name"]]: MapCairoType<
                        K["type"]
                    >;
                }
              : {};
      }
    : never;

/**
 * Main type extractor for Dojo manifest
 */
export type ExtractManifestTypes<Manifest> = Manifest extends {
    world?: infer World;
    contracts?: infer Contracts;
    models?: infer Models;
    events?: infer Events;
}
    ? {
          world: World extends { abi: infer ABI }
              ? ExtractAbiTypesFromArray<ABI>
              : never;
          contracts: Contracts extends readonly any[]
              ? {
                    [K in Contracts[number] as K extends { tag: infer Tag }
                        ? Tag extends string
                            ? Tag
                            : never
                        : never]: ExtractContractTypes<K>;
                }
              : {};
          models: Models extends readonly any[]
              ? {
                    [K in Models[number] as K extends { tag: infer Tag }
                        ? Tag extends string
                            ? Tag
                            : never
                        : never]: ExtractModelType<K>;
                }
              : {};
          events: Events extends readonly any[]
              ? {
                    [K in Events[number] as K extends { tag: infer Tag }
                        ? Tag extends string
                            ? Tag
                            : never
                        : never]: ExtractEventType<K>;
                }
              : {};
      }
    : never;

/**
 * Helper type to get a specific model type
 */
export type GetModel<
    Manifest,
    ModelName extends string,
> = ExtractManifestTypes<Manifest> extends { models: infer Models }
    ? ModelName extends keyof Models
        ? Models[ModelName] extends { fields: infer Fields }
            ? Fields
            : never
        : never
    : never;

/**
 * Helper type to get a specific contract's function
 */
export type GetContractFunction<
    Manifest,
    ContractName extends string,
    FunctionName extends string,
> = ExtractManifestTypes<Manifest> extends { contracts: infer Contracts }
    ? ContractName extends keyof Contracts
        ? Contracts[ContractName] extends {
              abi: { functions: infer Functions };
          }
            ? FunctionName extends keyof Functions
                ? Functions[FunctionName]
                : never
            : never
        : never
    : never;

/**
 * Extract ABIs from contracts array
 */
type ExtractContractAbis<Contracts> = Contracts extends readonly [
    infer First,
    ...infer Rest,
]
    ? First extends { abi: infer Abi }
        ? Abi extends readonly any[]
            ? [Abi, ...ExtractContractAbis<Rest>]
            : ExtractContractAbis<Rest>
        : ExtractContractAbis<Rest>
    : [];

/**
 * Extract all ABIs from a single manifest
 */
type ExtractAllAbisFromManifest<Manifest> = Manifest extends {
    world?: { abi: infer WorldAbi };
    contracts?: infer Contracts;
}
    ? [
          ...(WorldAbi extends readonly any[] ? [WorldAbi] : []),
          ...ExtractContractAbis<Contracts>,
      ]
    : [];

/**
 * Flatten array of ABI arrays into a single ABI array
 */
type FlattenAbis<Abis> = Abis extends readonly [infer First, ...infer Rest]
    ? First extends readonly any[]
        ? [...First, ...FlattenAbis<Rest>]
        : FlattenAbis<Rest>
    : [];

/**
 * Merge two ABI type objects
 */
type MergeAbiTypesPair<T1, T2> = T1 extends {
    structs: infer S1;
    enums: infer E1;
    functions: infer F1;
}
    ? T2 extends {
          structs: infer S2;
          enums: infer E2;
          functions: infer F2;
      }
        ? {
              structs: S1 & S2;
              enums: E1 & E2;
              functions: F1 & F2;
          }
        : T1
    : T2;

/**
 * Extract ABI types from a single manifest
 */
type ExtractAbiTypesFromSingleManifest<Manifest> = ExtractAbiTypesFromArray<
    FlattenAbis<ExtractAllAbisFromManifest<Manifest>>
>;

/**
 * Extract ABI types from multiple manifests (supports up to 5 manifests)
 */
type ExtractAbiTypesFromManifests<Manifests extends readonly any[]> =
    Manifests extends readonly [infer M1]
        ? ExtractAbiTypesFromSingleManifest<M1>
        : Manifests extends readonly [infer M1, infer M2]
          ? MergeAbiTypesPair<
                ExtractAbiTypesFromSingleManifest<M1>,
                ExtractAbiTypesFromSingleManifest<M2>
            >
          : Manifests extends readonly [infer M1, infer M2, infer M3]
            ? MergeAbiTypesPair<
                  MergeAbiTypesPair<
                      ExtractAbiTypesFromSingleManifest<M1>,
                      ExtractAbiTypesFromSingleManifest<M2>
                  >,
                  ExtractAbiTypesFromSingleManifest<M3>
              >
            : Manifests extends readonly [
                    infer M1,
                    infer M2,
                    infer M3,
                    infer M4,
                ]
              ? MergeAbiTypesPair<
                    MergeAbiTypesPair<
                        MergeAbiTypesPair<
                            ExtractAbiTypesFromSingleManifest<M1>,
                            ExtractAbiTypesFromSingleManifest<M2>
                        >,
                        ExtractAbiTypesFromSingleManifest<M3>
                    >,
                    ExtractAbiTypesFromSingleManifest<M4>
                >
              : Manifests extends readonly [
                      infer M1,
                      infer M2,
                      infer M3,
                      infer M4,
                      infer M5,
                  ]
                ? MergeAbiTypesPair<
                      MergeAbiTypesPair<
                          MergeAbiTypesPair<
                              MergeAbiTypesPair<
                                  ExtractAbiTypesFromSingleManifest<M1>,
                                  ExtractAbiTypesFromSingleManifest<M2>
                              >,
                              ExtractAbiTypesFromSingleManifest<M3>
                          >,
                          ExtractAbiTypesFromSingleManifest<M4>
                      >,
                      ExtractAbiTypesFromSingleManifest<M5>
                  >
                : { structs: {}; enums: {}; functions: {} };

/**
 * Main exported type for extracting ABI types from multiple manifests
 * Usage:
 * - Single ABI array: type MyAbi = ExtractAbiTypes<typeof abi>
 * - Single manifest: type MyAbi = ExtractAbiTypes<typeof manifest>
 * - Multiple manifests: type MyAbi = ExtractAbiTypes<[typeof manifest1, typeof manifest2, typeof manifest3]>
 * - Compiled ABI: type MyAbi = ExtractAbiTypes<typeof compiledAbi>
 */
export type ExtractAbiTypes<T> = T extends { abi: infer ABI }
    ? ABI extends readonly any[]
        ? ExtractAbiTypesFromArray<ABI>
        : never
    : T extends readonly any[]
      ? T extends readonly { type: string }[]
          ? ExtractAbiTypesFromArray<T>
          : ExtractAbiTypesFromManifests<T>
      : ExtractAbiTypesFromManifests<[T]>;
