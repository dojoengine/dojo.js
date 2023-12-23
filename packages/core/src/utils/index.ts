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
            // Check if the last part matches or if the full name matches
            return (
                nameParts[nameParts.length - 1] === name ||
                contract.name === name
            );
        })?.address || ""
    );
};

/**
 * Parses a model name into a class name.
 *
 * @param {any} model - The model object.
 * @returns {string} The class name.
 *
 */
export const parseModelName = (model: any) => {
    // Define a set of known acronyms
    const acronyms = new Set(["ERC"]);

    return model.name
        .split("::")
        .pop()
        .split("_")
        .map((part: string) => {
            // If the part is a known acronym, keep it in uppercase
            if (acronyms.has(part.toUpperCase())) {
                return part.toUpperCase();
            }
            // If the part is fully numeric, keep it as is
            if (!isNaN(parseInt(part))) {
                return part;
            }
            // Capitalize the first letter and make the rest lowercase
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
};
