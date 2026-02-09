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
import type { NUMSGame, GameViewModel } from "../../../../core/nums-types";

const clause = KeysClause([], [], "VariableLen").build();
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

const gamesAtom = Atom.make((get) => {
    const entities = get(entitiesAtom);
    return Result.map(entities, (value) => {
        return value.items
            .filter((entity) => entity.models.NUMS?.Game)
            .map((entity): GameViewModel => {
                // Cast once at the boundary — the Torii response is untyped
                // but we know the shape from the on-chain model definition.
                const game = entity.models.NUMS!.Game as NUMSGame;
                return {
                    entityId: entity.entityId,
                    ...game,
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

function GameList(): React.JSX.Element {
    const games = useAtomValue(gamesAtom);

    return Result.match(games, {
        onSuccess: ({ value: games }) => (
            <div>
                <h2>Games (NUMS.Game)</h2>
                <p>Count: {games.length}</p>
                <ul>
                    {games.map((game) => (
                        <li key={game.entityId}>
                            Game #{game.id} - Level: {game.level}, Score:{" "}
                            {game.score}, Over: {String(game.over)}
                        </li>
                    ))}
                </ul>
            </div>
        ),
        onFailure: (error) => (
            <div>Failed to load games: {error.cause.toString()}</div>
        ),
        onInitial: () => <div>Loading games...</div>,
    });
}

export function Home(): React.JSX.Element {
    return (
        <div>
            <h1>Entities</h1>
            <EntityList />
            <EntitySubscriber />
            <EntityInfiniteScroll />
            <GameList />
        </div>
    );
}
