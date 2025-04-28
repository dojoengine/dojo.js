import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";
import type { ParsedEntity, SchemaType } from "./types";

/**
 * Check if a value is a CairoOption
 * @param value - The value to check
 * @returns True if the value is a CairoOption, false otherwise
 */
export function isCairoOption(value: unknown): value is CairoOption<unknown> {
    return value instanceof CairoOption;
}

/**
 * Merge two CairoOption instances
 * @param target - The target CairoOption
 * @param source - The source CairoOption
 * @returns A new CairoOption instance with the merged value
 */
export function mergeCairoOption<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    // If source is Some, prefer source's value
    if (source instanceof CairoOption && source.isSome()) {
        return new CairoOption(
            CairoOptionVariant.Some,
            source.unwrap()
        ) as unknown as MergedModels<T>;
    }

    // If source is None or undefined, keep target
    if (target instanceof CairoOption) {
        if (target.isSome()) {
            return new CairoOption(
                CairoOptionVariant.Some,
                target.unwrap()
            ) as unknown as MergedModels<T>;
        }
        return new CairoOption(
            CairoOptionVariant.None
        ) as unknown as MergedModels<T>;
    }

    // This should not happen if both are CairoOption instances
    return target as unknown as MergedModels<T>;
}

/**
 * Check if a value is a CairoCustomEnum
 * @param value - The value to check
 * @returns True if the value is a CairoCustomEnum, false otherwise
 */
export function isCairoCustomEnum(value: unknown): value is CairoCustomEnum {
    return value instanceof CairoCustomEnum;
}

/**
 * Merge two CairoCustomEnum instances
 * @param target - The target CairoCustomEnum
 * @param source - The source CairoCustomEnum
 * @returns A new CairoCustomEnum instance with the merged value
 */
export function mergeCairoCustomEnum<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    if (!isCairoCustomEnum(target) || !isCairoCustomEnum(source)) {
        return target;
    }
    // If source has an active variant, prefer it
    const sourceActiveVariant = source.activeVariant();
    const sourceValue = source.unwrap();

    if (sourceActiveVariant && sourceValue !== undefined) {
        // Create a new enum with source's active variant
        const newEnumContent: Record<string, any> = {};

        // Initialize all variants from target with undefined
        for (const key in target.variant) {
            newEnumContent[key] = undefined;
        }

        // Set the active variant from source
        newEnumContent[sourceActiveVariant] = sourceValue;

        return new CairoCustomEnum(
            newEnumContent
        ) as unknown as MergedModels<T>;
    }

    // If source doesn't have an active variant, keep target
    const targetActiveVariant = target.activeVariant();
    const targetValue = target.unwrap();

    if (targetActiveVariant && targetValue !== undefined) {
        const newEnumContent: Record<string, any> = {};

        // Initialize all variants with undefined
        for (const key in target.variant) {
            newEnumContent[key] = undefined;
        }

        // Set the active variant from target
        newEnumContent[targetActiveVariant] = targetValue;

        return new CairoCustomEnum(
            newEnumContent
        ) as unknown as MergedModels<T>;
    }

    // Fallback if not both CairoCustomEnum
    return target;
}

/**
 * Merged models type
 * @template T - The schema type
 * @returns The merged models type
 */
export type MergedModels<T extends SchemaType> =
    ParsedEntity<T>["models"][keyof ParsedEntity<T>["models"]];

export function deepMerge<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    if (isCairoOption(target) && isCairoOption(source)) {
        return mergeCairoOption(target, source);
    }
    if (isCairoCustomEnum(target) && isCairoCustomEnum(source)) {
        return mergeCairoCustomEnum(target, source);
    }
    const result = { ...target } as Record<string, any>;
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (
                source[key] !== null &&
                typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                // If the property is an object in both source and target, recursively merge
                if (
                    key in target &&
                    typeof target[key] === "object" &&
                    !Array.isArray(target[key])
                ) {
                    result[key] = deepMerge(target[key], source[key]);
                } else {
                    // If the key doesn't exist in target or isn't an object, just assign
                    result[key] = source[key];
                }
            } else {
                // For non-objects (primitives, arrays, null), just assign
                result[key] = source[key];
            }
        }
    }

    return result;
}
