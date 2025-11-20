import { createRoot } from "react-dom/client";

import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import { createEntityUpdatesAtom } from "./effect";
import { createEntityQueryAtom } from "./effect/atoms/entities";

const clause = KeysClause([], [], "VariableLen").build();
const entitiesAtom = createEntityQueryAtom(
    new ToriiQueryBuilder()
        .withClause(clause)
        .includeHashedKeys()
        .withLimit(1000)
);
const subscriptionAtom = createEntityUpdatesAtom(clause, null);

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

function Root() {
    return (
        <div>
            <h1>Hello Dojo</h1>
            <EntityList />
            <EntitySubscriber />
        </div>
    );
}

async function main() {
    const container = document.getElementById("root");
    if (!container) {
        throw new Error("Root element not found");
    }

    createRoot(container).render(<Root />);
}

main().catch(console.error);
