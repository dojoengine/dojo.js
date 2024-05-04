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
