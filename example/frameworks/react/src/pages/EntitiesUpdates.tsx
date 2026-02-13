import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import { createEntityQueryWithUpdatesAtom } from "@dojoengine/react/effect";

import { toriiRuntime } from "../effect/atoms";
import type { Position, Moves } from "@showcase/dojo";

const clause = KeysClause(
    ["dojo_starter-Position", "dojo_starter-Moves"],
    [],
    "VariableLen"
).build();

const query = new ToriiQueryBuilder()
    .withClause(clause)
    .includeHashedKeys()
    .withLimit(1000);

const entitiesWithUpdatesAtom = createEntityQueryWithUpdatesAtom(
    toriiRuntime,
    query,
    clause,
    null
);

function EntitiesWithUpdates(): React.JSX.Element {
    const result = useAtomValue(entitiesWithUpdatesAtom);

    return Result.match(result, {
        onSuccess: ({ value }) => {
            return (
                <div>
                    <h2>Entities with Live Updates</h2>
                    <p>Total Entities: {value.items.length}</p>
                    <p>
                        This component automatically reconciles real-time
                        updates with the initial query data.
                    </p>
                    <h3>All Entities</h3>
                    <ul>
                        {value.items.slice(0, 10).map((entity) => (
                            <li key={entity.entityId}>
                                <strong>
                                    {entity.entityId.slice(0, 16)}...
                                </strong>
                                <div style={{ marginLeft: "20px" }}>
                                    {Object.keys(entity.models).map(
                                        (schemaKey) => (
                                            <div key={schemaKey}>
                                                {schemaKey}:{" "}
                                                {Object.keys(
                                                    entity.models[schemaKey] ||
                                                        {}
                                                ).join(", ")}
                                            </div>
                                        )
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3>Position & Moves</h3>
                    <ul>
                        {value.items
                            .filter(
                                (entity) =>
                                    entity.models.dojo_starter?.Position ||
                                    entity.models.dojo_starter?.Moves
                            )
                            .slice(0, 10)
                            .map((entity) => {
                                const position = entity.models.dojo_starter
                                    ?.Position as Position | undefined;
                                const moves = entity.models.dojo_starter
                                    ?.Moves as Moves | undefined;
                                return (
                                    <li key={entity.entityId}>
                                        {entity.entityId.slice(0, 16)}
                                        ...
                                        {position && (
                                            <span>
                                                {" "}
                                                | Pos: ({position.vec.x},{" "}
                                                {position.vec.y})
                                            </span>
                                        )}
                                        {moves && (
                                            <span>
                                                {" "}
                                                | Remaining: {moves.remaining}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                <h2>Error Loading Entities</h2>
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div>Loading entities with live updates...</div>,
    });
}

export function EntitiesUpdates(): React.JSX.Element {
    return (
        <div>
            <h1>Entities with Automatic Updates</h1>
            <p>
                This page demonstrates{" "}
                <code>createEntityQueryWithUpdatesAtom</code>, which combines
                query + subscription with automatic reconciliation.
            </p>
            <EntitiesWithUpdates />
        </div>
    );
}
