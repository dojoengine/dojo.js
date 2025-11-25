import { Result, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import {
    createTokenQueryAtom,
    createTokensInfiniteScrollAtom,
    createTokenUpdatesAtom,
} from "@dojoengine/react/effect";
import { defaultToriiPagination, ToriiQueryBuilder } from "@dojoengine/sdk";
import { toriiRuntime } from "../effect";

const query = {
    contract_addresses: [],
    token_ids: [],
    attribute_filters: [],
    pagination: {
        ...defaultToriiPagination,
        limit: 100,
    },
};
const tokensAtom = createTokenQueryAtom(toriiRuntime, query);
const tokenSubscriptionAtom = createTokenUpdatesAtom(toriiRuntime, null, null);

const { stateAtom: infiniteScrollState, loadMoreAtom: loadMoreEntities } =
    createTokensInfiniteScrollAtom(toriiRuntime, query, 10);

function TokenList() {
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

function TokenSubscriber() {
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

function TokensInfiniteScroll() {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreEntities);
    console.log(state);

    return (
        <div>
            <h2>Infinite Scroll Entities</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((token: any, idx: number) => (
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

export function Tokens() {
    return (
        <div>
            <h1>Tokens</h1>
            <TokenList />
            <TokenSubscriber />
            <TokensInfiniteScroll />
        </div>
    );
}
