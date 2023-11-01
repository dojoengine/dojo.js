import { BurnerProvider, useBurner } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account, RpcProvider } from "starknet";
import { SetupResult } from "./dojo/setup";

interface DojoContextType extends SetupResult {
    masterAccount: Account;
}

const DojoContext = createContext<DojoContextType | null>(null);

const requiredEnvs = [
    "VITE_PUBLIC_MASTER_ADDRESS",
    "VITE_PUBLIC_MASTER_PRIVATE_KEY",
    "VITE_PUBLIC_ACCOUNT_CLASS_HASH",
];

for (const env of requiredEnvs) {
    if (!import.meta.env[env]) {
        throw new Error(`Environment variable ${env} is not set!`);
    }
}

type DojoProviderProps = {
    children: ReactNode;
    value: SetupResult;
};

export const DojoProvider = ({ children, value }: DojoProviderProps) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const rpcProvider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl:
                    import.meta.env.VITE_PUBLIC_NODE_URL ||
                    "http://localhost:5050",
            }),
        []
    );

    const masterAddress = import.meta.env.VITE_PUBLIC_MASTER_ADDRESS;
    const privateKey = import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY;
    const accountClassHash = import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH;
    const masterAccount = useMemo(
        () => new Account(rpcProvider, masterAddress, privateKey),
        [rpcProvider, masterAddress, privateKey]
    );

    return (
        <BurnerProvider
            initOptions={{ masterAccount, accountClassHash, rpcProvider }}
        >
            <DojoContext.Provider value={{ ...value, masterAccount }}>
                {children}
            </DojoContext.Provider>
        </BurnerProvider>
    );
};

export const useDojo = () => {
    const contextValue = useContext(DojoContext);
    if (!contextValue)
        throw new Error(
            "The `useDojo` hook must be used within a `DojoProvider`"
        );

    const {
        create,
        list,
        get,
        account,
        select,
        isDeploying,
        clear,
        copyToClipboard,
        applyFromClipboard,
    } = useBurner();

    return {
        setup: contextValue,
        account: {
            create,
            list,
            get,
            select,
            clear,
            account: account ?? contextValue.masterAccount,
            isDeploying,
            copyToClipboard,
            applyFromClipboard,
        },
    };
};
