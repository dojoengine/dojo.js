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
    return model.name
        .split("::")
        .pop()
        .split("_")
        .map((part: string) => {
            // Check if the part is a number
            if (!isNaN(parseInt(part))) {
                return part; // Keep numbers as is
            }
            // Convert part to uppercase if it's a known acronym or before a number
            if (part.length <= 3 || !isNaN(parseInt(part.charAt(0)))) {
                return part.toUpperCase();
            }
            // Otherwise, capitalize the first letter and make the rest lowercase
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
};
