import { useTokens, WithAccount } from "@dojoengine/sdk/react";

function TokenBalance({ address }: { address: `0x${string}` }) {
    const { tokens, getBalance, toDecimal } = useTokens({
        accountAddresses: [address],
    });

    return (
        <div>
            Token Balance: {address}
            <div>
                {tokens.map((token, idx) => (
                    <div key={idx}>
                        {token.symbol}
                        &nbsp;
                        {toDecimal(token, getBalance(token))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WithAccount(TokenBalance);
