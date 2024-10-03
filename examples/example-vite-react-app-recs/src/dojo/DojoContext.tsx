import { createContext, ReactNode, useContext, useMemo } from "react";
import { BurnerAccount, useBurnerManager } from "@dojoengine/create-burner";
import { Account } from "starknet";

import { SetupResult } from "./setup";

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
    if (currentValue) {
        throw new Error("DojoProvider can only be used once");
    }

    const {
        config: { masterAddress, masterPrivateKey },
        burnerManager,
        dojoProvider,
    } = value;

    const masterAccount = useMemo(
        () =>
            new Account(
                dojoProvider.provider,
                masterAddress,
                masterPrivateKey,
                "1"
            ),
        [masterAddress, masterPrivateKey, dojoProvider.provider]
    );

    const burnerManagerData = useBurnerManager({ burnerManager });

    return (
        <DojoContext.Provider
            value={{
                ...value,
                masterAccount,
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
