import { useEffect, useMemo } from "react";
import { useAccount, useProvider } from "@starknet-start/react";
import { type AccountInterface, WalletAccountV5 } from "starknet";

interface WithAccountProps {
    account: AccountInterface;
    address: `0x${string}`;
}

export function WithAccount<P extends object>(
    Component: React.ComponentType<P>,
    Fallback: React.ComponentType = () => <div>Please connect your wallet</div>
): (props: Omit<P, keyof WithAccountProps>) => React.ReactNode {
    return (props) => {
        const { address, connector } = useAccount();
        const { paymasterProvider, provider } = useProvider();
        const account = useMemo(
            () =>
                address && connector
                    ? new WalletAccountV5({
                          address,
                          paymaster: paymasterProvider,
                          provider,
                          walletProvider: connector,
                      })
                    : undefined,
            [address, connector, paymasterProvider, provider]
        );

        useEffect(() => {
            return () => account?.unsubscribeChange();
        }, [account]);

        if (!address || !account) {
            return Fallback ? <Fallback /> : null;
        }
        const mergedProps = { ...props, account, address } as P &
            WithAccountProps;
        return <Component {...mergedProps} />;
    };
}
