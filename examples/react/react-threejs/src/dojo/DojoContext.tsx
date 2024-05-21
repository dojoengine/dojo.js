import { BurnerManagerHook, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account, RpcProvider } from "starknet";
import { SetupResult } from "./generated/setup";

interface DojoContextType extends SetupResult {
    masterAccount: Account;
    burnerManagerHook: BurnerManagerHook;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: SetupResult;
}) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const {
        config: { rpcUrl, masterAddress, masterPrivateKey },
        burnerManager,
    } = value;

    const rpcProvider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl: rpcUrl,
            }),
        [rpcUrl]
    );

    const masterAccount = useMemo(
        () => new Account(rpcProvider, masterAddress, masterPrivateKey),
        [rpcProvider, masterAddress, masterPrivateKey]
    );

    const burnerManagerHook = useBurnerManager({
        burnerManager,
    });

    return (
        <DojoContext.Provider
            value={{
                ...value,
                masterAccount,
                burnerManagerHook: {
                    ...burnerManagerHook,
                    account: burnerManager
                        ? burnerManager.account
                        : masterAccount,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
