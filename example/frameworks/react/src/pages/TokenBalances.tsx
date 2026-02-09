import { Result, useAtomValue, useAtomSet } from "@effect-atom/atom-react";
import type { TokenBalance } from "@dojoengine/torii-client";
import {
    createTokenBalanceQueryAtom,
    createTokenBalanceUpdatesAtom,
    createTokenBalancesInfiniteScrollAtom,
} from "@dojoengine/react/effect";
import { defaultToriiPagination } from "@dojoengine/sdk";
import { toriiRuntime } from "../effect";

const tokenBalancesAtom = createTokenBalanceQueryAtom(toriiRuntime, {
    account_addresses: [],
    contract_addresses: [],
    token_ids: [],
    pagination: defaultToriiPagination,
});
const tokenBalanceSubscriptionAtom = createTokenBalanceUpdatesAtom(
    toriiRuntime,
    {
        account_addresses: [],
        contract_addresses: [],
        token_ids: [],
        pagination: defaultToriiPagination,
    }
);

const { stateAtom: infiniteScrollState, loadMoreAtom: loadMoreBalances } =
    createTokenBalancesInfiniteScrollAtom(
        toriiRuntime,
        {
            account_addresses: [],
            contract_addresses: [],
            token_ids: [],
        },
        10
    );

function TokenBalanceList(): JSX.Element {
    const balances = useAtomValue(tokenBalancesAtom);
    return Result.match(balances, {
        onSuccess: ({ value: balances }) => {
            return (
                <div>
                    <h2>Token Balances</h2>
                    <p>Balances: {balances.items?.length ?? 0}</p>
                    <ul>
                        {(balances.items ?? [])
                            .slice(0, 10)
                            .map((balance, idx) => (
                                <li key={idx}>
                                    {JSON.stringify(balance).slice(0, 50)}...
                                </li>
                            ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to retrieve token balances
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function TokenBalanceSubscriber(): JSX.Element {
    const sub = useAtomValue(tokenBalanceSubscriptionAtom);

    return Result.match(sub, {
        onSuccess: ({ value: balances }) => {
            return (
                <div>
                    <h2>Token Balance Updates (Polling)</h2>
                    <p>Balances: {balances.items?.length ?? 0}</p>
                    <ul>
                        {(balances.items ?? [])
                            .slice(0, 10)
                            .map((balance, idx) => (
                                <li key={idx}>
                                    {JSON.stringify(balance).slice(0, 50)}...
                                </li>
                            ))}
                    </ul>
                </div>
            );
        },
        onFailure: (error) => (
            <div>
                Failed to poll token balances
                <pre>{error.cause.toString()}</pre>
            </div>
        ),
        onInitial: () => <div> Initial</div>,
    });
}

function TokenBalanceInfiniteScroll(): JSX.Element {
    const state = useAtomValue(infiniteScrollState);
    const loadMore = useAtomSet(loadMoreBalances);

    return (
        <div>
            <h2>Infinite Scroll Token Balances</h2>
            <p>
                Loaded: {state.items.length} | Has More: {String(state.hasMore)}
            </p>
            <ul>
                {state.items.map((balance: TokenBalance, idx: number) => (
                    <li key={idx}>{JSON.stringify(balance).slice(0, 50)}...</li>
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

export function TokenBalances(): JSX.Element {
    return (
        <div>
            <h1>Token Balances</h1>
            <TokenBalanceList />
            <TokenBalanceSubscriber />
            <TokenBalanceInfiniteScroll />
        </div>
    );
}
