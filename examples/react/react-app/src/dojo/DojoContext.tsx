import { BurnerAccount, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account } from "starknet";
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

    const {
        create,
        list,
        get,
        account,
        select,
        isDeploying,
        clear,
        count,
        copyToClipboard,
        applyFromClipboard,
    } = useBurnerManager({
        burnerManager,
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
                    count,
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
