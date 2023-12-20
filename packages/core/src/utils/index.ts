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
        manifest.contracts.find((contract: any) => {
            const nameParts = contract.name.split("::");
            return nameParts[nameParts.length - 1] === name;
        })?.address || ""
    );
};
