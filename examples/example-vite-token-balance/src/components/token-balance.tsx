import {
    useTokenBalances,
    useTokens,
    WithAccount,
} from "@dojoengine/sdk/react";
import { addAddressPadding } from "starknet";

function TokenBalance({ address }: { address: `0x${string}` }) {
    const balance = useTokenBalances({
        accountAddresses: [addAddressPadding(address)],
    });
    const tokens = useTokens({});

    return (
        <div>
            Token Balance: {address}
            <div>
                {tokens.map((token, idx) => (
                    <div key={idx}>
                        {token.symbol}
                        &nbsp;
                        {Number.parseInt(
                            balance.find(
                                (b) =>
                                    b.contract_address ===
                                    token.contract_address
                            )?.balance ?? "0",
                            16
                        ) *
                            10 ** -token.decimals}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WithAccount(TokenBalance);
