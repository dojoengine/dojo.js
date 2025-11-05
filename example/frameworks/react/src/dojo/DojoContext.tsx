import {
    type BurnerAccount,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { Account } from "starknet";

import type { SetupResult } from "@showcase/dojo";

interface DojoContextValue extends SetupResult {
    masterAccount: Account;
    account: BurnerAccount;
}

const DojoContext = createContext<DojoContextValue | null>(null);

export const useDojoContext = () => {
    const context = useContext(DojoContext);
    if (!context) {
        throw new Error("Dojo context is not available");
    }
    return context;
};

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
            new Account({
                provider: dojoProvider.provider,
                address: masterAddress,
                signer: masterPrivateKey,
            }),
        [dojoProvider.provider, masterAddress, masterPrivateKey]
    );

    const burner = useBurnerManager({
        burnerManager,
    });

    return (
        <DojoContext.Provider
            value={{
                ...value,
                masterAccount,
                account: {
                    ...burner,
                    account: burner.account ? burner.account : masterAccount,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
