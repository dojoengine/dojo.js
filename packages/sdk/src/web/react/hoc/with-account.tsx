import { useAccount } from "@starknet-react/core";
import type { AccountInterface } from "starknet";

interface WithAccountProps {
    account: AccountInterface;
    address: `0x${string}`;
}

export function WithAccount<P extends object>(
    Component: React.ComponentType<P>,
    Fallback: React.ComponentType = () => <div>Please connect your wallet</div>
): (props: Omit<P, keyof WithAccountProps>) => React.ReactNode {
    return (props) => {
        const { account, address } = useAccount();
        if (!address) {
            return Fallback ? <Fallback /> : null;
        }
        const mergedProps = { ...props, account, address } as P &
            WithAccountProps;
        return <Component {...mergedProps} />;
    };
}
