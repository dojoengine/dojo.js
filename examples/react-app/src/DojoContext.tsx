import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "./dojo/setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

const DojoContext = createContext<SetupResult | null>(null);

type Props = {
    children: ReactNode;
    value: SetupResult;
};

export const DojoProvider = ({ children, value }: Props) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");
    return <DojoContext.Provider value={value}>{children}</DojoContext.Provider>;
};

export const useDojo = () => {
    const value = useContext(DojoContext);

    if (!value) throw new Error("The `useDojo` hook must be used within a `DojoProvider`");

    const provider = useMemo(() => new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!
    }), []);

    // 
    // this can be substituted with a wallet provider
    //
    const masterAddress = import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!;
    const privateKey = import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!;
    const masterAccount = useMemo(() => new Account(provider, masterAddress, privateKey), [provider, masterAddress, privateKey]);

    const { create, list, get, account, select, isDeploying } = useBurner(
        {
            masterAccount: masterAccount,
            accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!
        }
    );

    return {
        setup: value,
        account: { create, list, get, select, account: account ? account : masterAccount, isDeploying }
    };
};