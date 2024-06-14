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

    const {
        config: { masterAddress, masterPrivateKey },
        dojoProvider,
    } = value;

    if (walletAccount) {
        masterAccount = walletAccount;
    } else {
        masterAccount = new Account(
            dojoProvider.provider,
            masterAddress,
            masterPrivateKey,
            "1"
        );
    }

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            {
                nodeUrl: dojoConfig.rpcUrl,
            },
            dojoConfig.masterAddress,
            dojoConfig.masterPrivateKey
        ),
        accountClassHash: dojoConfig.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: dojoConfig.feeTokenAddress,
    });

    const {
        create,
        list,
        get,
        select,
        deselect,
        remove,
        clear,
        account,
        isDeploying,
        count,
        copyToClipboard,
        applyFromClipboard,
        checkIsDeployed,
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
                    deselect,
                    remove,
                    clear,
                    account: (account as any)
                        ? (account as any)
                        : masterAccount,
                    isDeploying,
                    count,
                    copyToClipboard,
                    applyFromClipboard,
                    checkIsDeployed,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
