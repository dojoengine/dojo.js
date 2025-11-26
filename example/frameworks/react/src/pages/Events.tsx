import {
    Result,
    useAtomValue,
    useAtomSet,
    Atom,
} from "@effect-atom/atom-react";
import {
    createEventQueryAtom,
    createEventUpdatesAtom,
    createEventsInfiniteScrollAtom,
} from "@dojoengine/react/effect";
import { toriiRuntime } from "../effect";

const eventsAtom = createEventQueryAtom(toriiRuntime, {
    keys: undefined,
});
const eventSubscriptionAtom = createEventUpdatesAtom(toriiRuntime, []);

const { stateAtom: infiniteScrollState, loadMoreAtom: loadMoreEvents } =
    createEventsInfiniteScrollAtom(toriiRuntime, { keys: undefined }, 10);

function EventList() {
    const events = useAtomValue(eventsAtom);
    return Result.match(events, {
        onSuccess: ({ value: events }) => {
            const items = Array.isArray(events) ? events : (events.items ?? []);
            return (
                <div>
                    <h2>Registered Events</h2>
                    <p>Events: {items.length}</p>
                    <ul>
                        {items.slice(0, 10).map((event: any, idx: number) => (
                            <li key={idx}>
                                {JSON.stringify(event).slice(0, 50)}...
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to retrieve events
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function EventSubscriber() {
    const sub = useAtomValue(eventSubscriptionAtom);

    return Result.match(sub, {
        onSuccess: ({ value: events }) => {
            return (
                <div>
                    <h2>Event Updates</h2>
                    <p>Events: {events.length}</p>
                    <ul>
                        {events.slice(0, 10).map((event, idx) => (
                            <li key={idx}>
                                {JSON.stringify(event).slice(0, 50)}...
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to subscribe to event updates
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function EventInfiniteScroll() {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreEvents);

    return (
        <div>
            <h2>Infinite Scroll Events</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((event: any, idx: number) => (
                    <li key={idx}>{JSON.stringify(event).slice(0, 50)}...</li>
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

export function Events() {
    return (
        <div>
            <h1>Events</h1>
            <EventList />
            <EventSubscriber />
            <EventInfiniteScroll />
        </div>
    );
}
