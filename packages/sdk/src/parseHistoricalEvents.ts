import * as torii from "@dojoengine/torii-client";

import { ParsedEntity, SchemaType, StandardizedQueryResult } from "./types";
import { parseEntities } from "./parseEntities";

/**
 * Parses historical events returned by torii
 *
 * @template T - The schema type.
 * @param {torii.Entities} entities - The collection of entities to parse.
 * @param {{ logging?: boolean }} [options] - Optional settings for logging.
 * @returns {StandardizedQueryResult<T>} - The parsed entities in a standardized query result format.
 *
 * @example
 * const parsedResult = parseHistoricalEvents(entities, { logging: true });
 * console.log(parsedResult);
 */
export function parseHistoricalEvents<T extends SchemaType>(
    entities: torii.Entities,
    options?: { logging?: boolean }
): StandardizedQueryResult<T>[] {
    // Events come from torii flagged as "dojo_starter-Moved-idx"
    let events: torii.Entities[] = [];
    for (const entityId in entities) {
        const entityData = entities[entityId];
        const keys = Object.keys(entityData);

        //sort keys to preserve order given by torii
        const sortedKeys = keys.sort((a, b) => {
            // Extract the last number from each string using regex
            const getLastNumber = (str: string) => {
                const match = str.match(/-(\d+)$/);
                return match ? parseInt(match[1]) : 0;
            };

            return getLastNumber(a) - getLastNumber(b);
        });

        for (const model of sortedKeys) {
            const modelData = entityData[model];
            const modelNameSplit = model.split("-");
            modelNameSplit.pop();
            // event at index 0 does not have index thus, we take modelName as is
            const modelName =
                modelNameSplit.length > 1 ? modelNameSplit.join("-") : model;

            events = [...events, { [entityId]: { [modelName]: modelData } }];
        }
    }

    return events.map((e) => parseEntities<T>(e, options));
}
