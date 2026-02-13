import { Result, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import type { Token } from "@dojoengine/torii-client";
import {
    createTokenQueryAtom,
    createTokensInfiniteScrollAtom,
    createTokenUpdatesAtom,
} from "@dojoengine/react/effect";
import { toriiRuntime } from "../effect";

const query = {
    contract_addresses: [],
    token_ids: [],
    attribute_filters: [],
    pagination: {
        limit: 100,
        cursor: undefined,
        direction: "Forward" as const,
        order_by: [],
    },
};
const tokensAtom = createTokenQueryAtom(toriiRuntime, query);
const tokenSubscriptionAtom = createTokenUpdatesAtom(toriiRuntime, null, null);

const { stateAtom: infiniteScrollState, loadMoreAtom: loadMoreEntities } =
    createTokensInfiniteScrollAtom(toriiRuntime, query, 10);

function TokenList(): React.JSX.Element {
    const tokens = useAtomValue(tokensAtom);
    return Result.match(tokens, {
        onSuccess: ({ value: tokens }) => {
            return (
                <div>
                    <h2>Registered Tokens</h2>
                    <p>Tokens: {tokens.items?.length ?? 0}</p>
                    <ul>
                        {(tokens.items ?? []).slice(0, 10).map((token, idx) => (
                            <li key={idx}>
                                {JSON.stringify(token).slice(0, 50)}...
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to retrieve tokens list
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function TokenSubscriber(): React.JSX.Element {
    const sub = useAtomValue(tokenSubscriptionAtom);

    return Result.match(sub, {
        onSuccess: ({ value: tokens }) => {
            return (
                <div>
                    <h2>Token Updates</h2>
                    <p>Tokens: {tokens.length}</p>
                    <ul>
                        {tokens.slice(0, 10).map((token, idx) => (
                            <li key={idx}>
                                {JSON.stringify(token).slice(0, 50)}...
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to subscribe to token updates
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function TokensInfiniteScroll(): React.JSX.Element {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreEntities);

    return (
        <div>
            <h2>Infinite Scroll Tokens</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((token: Token, idx: number) => (
                    <li key={`${token.contract_address}-${idx}`}>
                        {token.contract_address.slice(0, 16)}...
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

export function Tokens(): React.JSX.Element {
    return (
        <div>
            <h1>Tokens</h1>
            <TokenList />
            <TokenSubscriber />
            <TokensInfiniteScroll />
        </div>
    );
}
