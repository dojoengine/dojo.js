import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
    Result,
    useAtomValue,
    useAtomSet,
    Atom,
} from "@effect-atom/atom-react";
import {
    createEntityUpdatesAtom,
    createEntityQueryAtom,
    createEntitiesInfiniteScrollAtom,
} from "@dojoengine/react/effect";
import { toriiRuntime } from "../effect/atoms";

interface GameViewModel {
    entityId: string;
    id: number;
    over: boolean;
    claimed: boolean;
    level: number;
    slot_count: number;
    slot_min: number;
    slot_max: number;
    number: number;
    next_number: number;
    tournament_id: number;
    selected_powers: number;
    available_powers: number;
    reward: number;
    score: number;
    slots: string;
}

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
            .map((entity) => {
                const game = entity.models.NUMS.Game as Record<string, unknown>;
                return {
                    entityId: entity.entityId,
                    id: game.id,
                    over: game.over,
                    claimed: game.claimed,
                    level: game.level,
                    slot_count: game.slot_count,
                    slot_min: game.slot_min,
                    slot_max: game.slot_max,
                    number: game.number,
                    next_number: game.next_number,
                    tournament_id: game.tournament_id,
                    selected_powers: game.selected_powers,
                    available_powers: game.available_powers,
                    reward: game.reward,
                    score: game.score,
                    slots: game.slots,
                } as GameViewModel;
            });
    });
});

function EntityList() {
    const entities = useAtomValue(entitiesAtom);

    return Result.match(entities, {
        onSuccess: ({ value: entities }) => {
            console.log(entities);
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

function EntityInfiniteScroll() {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreEntities);

    return (
        <div>
            <h2>Infinite Scroll Entities</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((entity: any) => (
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

function GameList() {
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

export function Home() {
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
