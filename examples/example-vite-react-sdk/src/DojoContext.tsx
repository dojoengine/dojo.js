import { createContext, ReactNode, useContext, useMemo } from "react";
import {
    BurnerAccount,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { Account } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { DojoProvider } from "@dojoengine/core";
import { setupWorld } from "./typescript/contracts.gen";

/**
 * Interface defining the shape of the Dojo context.
 */
interface DojoContextType {
    /** The master account used for administrative operations */
    masterAccount: Account;
    /** The Dojo client instance */
    client: ReturnType<typeof setupWorld>;
    /** The current burner account information */
    account: BurnerAccount;
}

/**
 * React context for sharing Dojo-related data throughout the application.
 */
export const DojoContext = createContext<DojoContextType | null>(null);

/**
 * Provider component that makes Dojo context available to child components.
 *
 * @param props.children - Child components that will have access to the Dojo context
 * @param props.burnerManager - Instance of BurnerManager for handling burner accounts
 * @throws {Error} If DojoProvider is used more than once in the component tree
 */
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
        [dojoProvider.provider]
    );

    const burnerManagerData = useBurnerManager({ burnerManager });

    return (
        <DojoContext.Provider
            value={{
                masterAccount,
                client: setupWorld(dojoProvider),
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
