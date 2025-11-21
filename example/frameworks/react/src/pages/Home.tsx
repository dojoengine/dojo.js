import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import {
    createEntityUpdatesAtom,
    createEntityQueryAtom,
} from "@dojoengine/react/effect";
import { toriiRuntime } from "../effect";

const clause = KeysClause([], [], "VariableLen").build();
const entitiesAtom = createEntityQueryAtom(
    toriiRuntime,
    new ToriiQueryBuilder()
        .withClause(clause)
        .includeHashedKeys()
        .withLimit(1000)
);
const subscriptionAtom = createEntityUpdatesAtom(toriiRuntime, clause, null);

function EntityList() {
    const entities = useAtomValue(entitiesAtom);

    return Result.match(entities, {
        onSuccess: ({ value: entities }) => {
            return (
                <div>
                    <h2>Registered Entities</h2>
                    <p>Entities: {entities.items.length}</p>
                    <ul>
                        {Array.from(entities.items)
                            .slice(0, 10)
                            .map((entity) => (
                                <li key={entity.entityId}>
                                    {entity.entityId.slice(0, 16)}...
                                </li>
                            ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to retrieve entities list
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function EntitySubscriber() {
    const sub = useAtomValue(subscriptionAtom);
    // const s = client.onEntityUpdated(clause, [], console.log).then(console.log);

    return Result.match(sub, {
        onSuccess: ({ value: entities }) => {
            return (
                <div>
                    <h2>Entity Updates</h2>
                    <p>Entities: {entities.size}</p>
                    <ul>
                        {Array.from(entities.values())
                            .slice(0, 10)
                            .map((entity) => (
                                <li key={entity.hashed_keys}>
                                    {entity.hashed_keys.slice(0, 16)}...
                                </li>
                            ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to subscribe to entities updates
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

export function Home() {
    return (
        <div>
            <h1>Entities</h1>
            <EntityList />
            <EntitySubscriber />
        </div>
    );
}
