import { shortString } from "starknet";

/**
 * Extracts the names of all components from a manifest.
 *
 * @param {any} manifest - The input manifest containing component details.
 * @returns {any} - An array containing the names of all components.
 */
export function getAllComponentNames(manifest: any): any {
    return manifest.components.map((component: any) => component.name);
}

/**
 * Extracts the names of all components from a manifest and converts them to `felt252` representation.
 *
 * @param {any} manifest - The input manifest containing component details.
 * @returns {any} - An array containing the `felt252` representation of component names.
 */
export function getAllComponentNamesAsFelt(manifest: any): any {
    return manifest.components.map((component: any) =>
        shortString.encodeShortString(component.name)
    );
}

/**
 * Extracts the names of all systems from a manifest.
 *
 * @param {any} manifest - The input manifest containing system details.
 * @returns {any} - An array containing the names of all systems.
 */
export function getAllSystemNames(manifest: any): any {
    return manifest.systems.map((system: any) => system.name);
}

/**
 * Extracts the names of all systems from a manifest and converts them to `felt252` representation.
 *
 * @param {any} manifest - The input manifest containing system details.
 * @returns {any} - An array containing the `felt252` representation of system names.
 */
export function getAllSystemNamesAsFelt(manifest: any): any {
    return manifest.systems.map((system: any) =>
        shortString.encodeShortString(system.name)
    );
}

/**
 * Gets a contract from a manifest by name.
 *
 * @param {any} manifest - The manifest object.
 * @param {string} name - The name of the contract.
 * @returns {any} The contract object.
 *
 */
export const getContractByName = (manifest: any, name: string) => {
    return (
        manifest.contracts.find((contract: any) => contract.name === name)
            ?.address || ""
    );
};
