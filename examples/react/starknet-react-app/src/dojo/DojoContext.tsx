import {
    BurnerAccount,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext } from "react";
import { Account, AccountInterface } from "starknet";
import { SetupResult } from "./generated/setup";
import { useAccount } from "@starknet-react/core";
import { dojoConfig } from "../../dojoConfig";

interface DojoContextType extends SetupResult {
    masterAccount: AccountInterface | undefined;
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

    let masterAccount: AccountInterface | undefined = undefined;

    const { account: walletAccount } = useAccount();

    if (walletAccount) {
        masterAccount = walletAccount;
    } else {
        const {
            config: { masterAddress, masterPrivateKey },
            dojoProvider,
        } = value;

        masterAccount = new Account(
            dojoProvider.provider,
            masterAddress,
            masterPrivateKey,
            "1"
        );
    }

    console.log(value.dojoProvider.provider);

    const burnerManager = new BurnerManager({
        masterAccount: masterAccount,
        accountClassHash: dojoConfig.accountClassHash,
        rpcProvider: value.dojoProvider.provider,
    });

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
