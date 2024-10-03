import { createContext, ReactNode, useContext, useMemo } from "react";
import {
    BurnerAccount,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { Account } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { DojoProvider } from "@dojoengine/core";
import { client } from "./contracts.gen";

interface DojoContextType {
    masterAccount: Account;
    client: ReturnType<typeof client>;
    account: BurnerAccount;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoContextProvider = ({
    children,
    burnerManager,
}: {
    children: ReactNode;
    burnerManager: BurnerManager;
}) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) {
        throw new Error("DojoProvider can only be used once");
    }

    const dojoProvider = new DojoProvider(
        dojoConfig.manifest,
        dojoConfig.rpcUrl
    );

    const masterAccount = useMemo(
        () =>
            new Account(
                dojoProvider.provider,
                dojoConfig.masterAddress,
                dojoConfig.masterPrivateKey,
                "1"
            ),
        []
    );

    const burnerManagerData = useBurnerManager({ burnerManager });

    return (
        <DojoContext.Provider
            value={{
                masterAccount,
                client: client(dojoProvider),
                account: {
                    ...burnerManagerData,
                    account: burnerManagerData.account || masterAccount,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
