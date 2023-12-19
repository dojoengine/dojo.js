import { IWorld } from "../types";

/**
 * Provider class: An abstract base class for all providers.
 * It implements the ICommands interface, ensuring that any class deriving from Provider
 * will have implementations for the entity and entities methods.
 */
export abstract class Provider implements IWorld {
    // Store the address of the world.
    private readonly worldAddress: string;

    /**
     * Constructor: Initializes the Provider with a given world address.
     *
     * @param {string} worldAddress - The address of the world.
     */
    constructor(worldAddress: string) {
        this.worldAddress = worldAddress;
    }

    /**
     * Abstract method to retrieve a single entity's details.
     * Classes extending Provider should provide a concrete implementation for this method.
     *
     * @param {string} component - The component to query.
     * @param {Query} query - The query details.
     * @param {number} offset - Starting offset.
     * @param {number} length - Length to retrieve.
     * @returns {Promise<Array<bigint>>} - A promise that resolves to an array of bigints representing the entity's details.
     */
    public abstract entity(
        model: string,
        keys: Array<string>,
        offset: number,
        length: number,
        layout: Array<number>
    ): Promise<Array<bigint>>;

    /**
     * Abstract method to retrieve multiple entities' details.
     * Classes extending Provider should provide a concrete implementation for this method.
     *
     * @param {string} component - The component to query.
     * @param {number} length - Number of entities to retrieve.
     * @returns {Promise<Array<bigint>>} - A promise that resolves to an array of bigints representing the entities' details.
     */
    public abstract entities(
        model: string,
        index: string | null,
        values: Array<string>,
        valuesLength: number,
        valuesLayout: Array<number>
    ): Promise<Array<Array<bigint>>>;

    /**
     * Retrieves the stored world address.
     *
     * @returns {string} - The address of the world.
     */
    public getWorldAddress(): string {
        return this.worldAddress;
    }
}
