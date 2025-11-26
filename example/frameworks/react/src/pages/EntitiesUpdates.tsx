import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import { createEntityQueryWithUpdatesAtom } from "@dojoengine/react/effect";
import { toriiRuntime } from "../effect/atoms";

const clause = KeysClause([], [], "VariableLen").build();
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

function EntitiesWithUpdates() {
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

                    <h3>Filtered: Games Only (NUMS.Game)</h3>
                    <ul>
                        {value.items
                            .filter((entity) => entity.models.NUMS?.Game)
                            .slice(0, 10)
                            .map((entity) => {
                                const game = entity.models.NUMS?.Game as Record<
                                    string,
                                    unknown
                                >;
                                return (
                                    <li key={entity.entityId}>
                                        Game #{game.id} - Level: {game.level},
                                        Score: {game.score}, Over:{" "}
                                        {String(game.over)}
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

export function EntitiesUpdates() {
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
