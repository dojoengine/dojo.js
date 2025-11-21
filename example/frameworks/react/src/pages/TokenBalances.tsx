import { Result, useAtomValue } from "@effect-atom/atom-react";
import {
    createTokenBalanceQueryAtom,
    createTokenBalanceUpdatesAtom,
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

function TokenBalanceList() {
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

function TokenBalanceSubscriber() {
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

export function TokenBalances() {
    return (
        <div>
            <h1>Token Balances</h1>
            <TokenBalanceList />
            <TokenBalanceSubscriber />
        </div>
    );
}
