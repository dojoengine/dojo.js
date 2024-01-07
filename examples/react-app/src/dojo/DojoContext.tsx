import {
    BurnerAccount,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account, RpcProvider } from "starknet";
import { SetupResult } from "./generated/setup";

interface DojoContextType extends SetupResult {
    masterAccount: Account;
    account: BurnerAccount;
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

    const rpcProvider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl: value.config.rpcUrl,
            }),
        [value.config.rpcUrl]
    );

    const masterAccount = useMemo(
        () =>
            new Account(
                rpcProvider,
                value.config.masterAddress,
                value.config.masterPrivateKey
            ),
        [rpcProvider, value.config.masterAddress, value.config.masterPrivateKey]
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
    } = useBurnerManager({
        burnerManager: new BurnerManager({
            masterAccount,
            accountClassHash: value.config.accountClassHash,
            rpcProvider,
        }),
    });

    return (
        <DojoContext.Provider
            value={{
                ...value,
                masterAccount,
                account: {
                    create,
                    list,
                    get,
                    select,
                    clear,
                    account: account ? account : masterAccount,
                    isDeploying,
                    copyToClipboard,
                    applyFromClipboard,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
