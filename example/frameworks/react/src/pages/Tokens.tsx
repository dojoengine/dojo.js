import { Result, useAtomValue } from "@effect-atom/atom-react";
import {
    createTokenQueryAtom,
    createTokenUpdatesAtom,
} from "../effect/atoms/tokens";
import { defaultToriiPagination } from "@dojoengine/sdk";

const tokensAtom = createTokenQueryAtom({
    contract_addresses: [],
    token_ids: [],
    attribute_filters: [],
    pagination: defaultToriiPagination,
});
const tokenSubscriptionAtom = createTokenUpdatesAtom(null, null);

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

export function Tokens() {
    return (
        <div>
            <h1>Tokens</h1>
            <TokenList />
            <TokenSubscriber />
        </div>
    );
}
