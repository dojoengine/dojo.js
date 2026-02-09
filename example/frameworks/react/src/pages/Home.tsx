import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
    Result,
    useAtomValue,
    useAtomSet,
    Atom,
} from "@effect-atom/atom-react";
import {
    type ParsedEntity,
    createEntityUpdatesAtom,
    createEntityQueryAtom,
    createEntitiesInfiniteScrollAtom,
} from "@dojoengine/react/effect";

import { toriiRuntime } from "../effect/atoms";
import type { Position, Moves } from "@showcase/dojo";

const clause = KeysClause(
    ["dojo_starter-Position", "dojo_starter-Moves"],
    [],
    "VariableLen"
).build();

const entitiesAtom = createEntityQueryAtom(
    toriiRuntime,
    new ToriiQueryBuilder()
        .withClause(clause)
        .includeHashedKeys()
        .withLimit(1000)
);

const subscriptionAtom = createEntityUpdatesAtom(toriiRuntime, clause, null);

const { stateAtom: infiniteScrollState, loadMoreAtom: loadMoreEntities } =
    createEntitiesInfiniteScrollAtom(
        toriiRuntime,
        new ToriiQueryBuilder().withClause(clause).includeHashedKeys(),
        10
    );

interface PositionMoves {
    entityId: string;
    position: Position | undefined;
    moves: Moves | undefined;
}

const positionMovesAtom = Atom.make((get) => {
    const entities = get(entitiesAtom);
    return Result.map(entities, (value) => {
        return value.items
            .filter(
                (entity) =>
                    entity.models.dojo_starter?.Position ||
                    entity.models.dojo_starter?.Moves
            )
            .map((entity): PositionMoves => {
                const position = entity.models.dojo_starter?.Position as
                    | Position
                    | undefined;
                const moves = entity.models.dojo_starter?.Moves as
                    | Moves
                    | undefined;
                return {
                    entityId: entity.entityId,
                    position,
                    moves,
                };
            });
    });
});

function EntityList(): React.JSX.Element {
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

function EntitySubscriber(): React.JSX.Element {
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

function EntityInfiniteScroll(): React.JSX.Element {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreEntities);

    return (
        <div>
            <h2>Infinite Scroll Entities</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((entity: ParsedEntity) => (
                    <li key={entity.entityId}>
                        {entity.entityId.slice(0, 16)}...
                    </li>
                ))}
            </ul>
            {state.hasMore && (
                <button onClick={loadMore} disabled={state.isLoading}>
                    {state.isLoading ? "Loading..." : "Load More"}
                </button>
            )}
            {state.error && (
                <div style={{ color: "red" }}>Error: {state.error.message}</div>
            )}
        </div>
    );
}

function PositionMovesList(): React.JSX.Element {
    const data = useAtomValue(positionMovesAtom);

    return Result.match(data, {
        onSuccess: ({ value: items }) => (
            <div>
                <h2>Position & Moves</h2>
                <p>Count: {items.length}</p>
                <ul>
                    {items.map((item) => (
                        <li key={item.entityId}>
                            {item.entityId.slice(0, 16)}...
                            {item.position && (
                                <span>
                                    {" "}
                                    | Pos: ({item.position.vec.x},{" "}
                                    {item.position.vec.y})
                                </span>
                            )}
                            {item.moves && (
                                <span>
                                    {" "}
                                    | Remaining: {item.moves.remaining}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        ),
        onFailure: (error) => (
            <div>Failed to load position/moves: {error.cause.toString()}</div>
        ),
        onInitial: () => <div>Loading position/moves...</div>,
    });
}

export function Home(): React.JSX.Element {
    return (
        <div>
            <h1>Entities</h1>
            <EntityList />
            <EntitySubscriber />
            <EntityInfiniteScroll />
            <PositionMovesList />
        </div>
    );
}
