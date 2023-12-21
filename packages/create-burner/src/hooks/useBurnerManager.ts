import { useCallback, useEffect, useState } from "react";
import { Account } from "starknet";
import { BurnerConnector } from "..";
import { BurnerManager } from "../manager/burnerManager";
import { Burner } from "../types";

/**
 * A React hook that takes the Burner Manager object avoiding the React Context.
 * Useful for building apps without React Context.
 *
 * @returns An object with utility methods and properties.
 */
export const useBurnerManager = ({
    burnerManager,
}: {
    burnerManager: BurnerManager; // Accepts the BurnerManager class as an parameter
}) => {
    if (!burnerManager.masterAccount) {
        throw new Error("BurnerManagerClass must be provided");
    }

    // State to manage the current active account.
    const [account, setAccount] = useState<Account | null>(null);
    const [burnerUpdate, setBurnerUpdate] = useState(0);
    const [isDeploying, setIsDeploying] = useState(false);

    // On mount, initialize the burner manager and set the active account.
    useEffect(() => {
        burnerManager.init();
        setAccount(burnerManager.getActiveAccount());
    }, []);

    /**
     * Lists all the burners available in the storage.
     *
     * @returns An array of Burner accounts.
     */
    const list = useCallback((): Burner[] => {
        return burnerManager.list();
    }, [burnerManager.list(), burnerUpdate]);

    /**
     * Selects and sets a burner as the active account.
     *
     * @param address - The address of the burner account to set as active.
     */
    const select = useCallback(
        (address: string): void => {
            burnerManager.select(address);
            setAccount(burnerManager.getActiveAccount());
        },
        [burnerManager]
    );

    /**
     * Retrieves a burner account based on its address.
     *
     * @param address - The address of the burner account to retrieve.
     * @returns The Burner account corresponding to the provided address.
     */
    const get = useCallback(
        (address: string): Account => {
            return burnerManager.get(address);
        },
        [burnerManager]
    );

    /**
     * Clears a burner account based on its address.
     *
     * @param address - The address of the burner account to retrieve.
     * @returns The Burner account corresponding to the provided address.
     */
    const clear = useCallback(() => {
        burnerManager.clear();
        setBurnerUpdate((prev) => prev + 1);
    }, [burnerManager]);

    /**
     * Creates a new burner account and sets it as the active account.
     *
     * @returns A promise that resolves to the newly created Burner account.
     */
    const create = useCallback(async (): Promise<Account> => {
        burnerManager.setIsDeployingCallback(setIsDeploying);
        const newAccount = await burnerManager.create();
        setAccount(newAccount);
        return newAccount;
    }, [burnerManager]);

    /**
     * Generates a list of BurnerConnector instances for each burner account. These can be added to Starknet React.
     *
     * @returns An array of BurnerConnector instances.
     */
    const listConnectors = useCallback((): BurnerConnector[] => {
        // Retrieve all the burners.
        const burners = list();

        // Map each burner to its respective BurnerConnector instance.
        return burners.map((burner) => {
            return new BurnerConnector(
                {
                    options: {
                        id: burner.address,
                    },
                },
                get(burner.address)
            );
        });
    }, [burnerManager.isDeploying]);

    /**
     * Copy burners to clipboard
     */
    const copyToClipboard = useCallback(async () => {
        await burnerManager.copyBurnersToClipboard();
    }, [burnerManager]);

    /**
     * Set burners from clipboard
     */
    const applyFromClipboard = useCallback(async () => {
        await burnerManager.setBurnersFromClipboard();

        // Update the burnerUpdate state to trigger a re-render.
        setAccount(burnerManager.getActiveAccount());

        setBurnerUpdate((prev) => prev + 1);
    }, [burnerManager]);

    return {
        get,
        list,
        select,
        create,
        listConnectors,
        clear,
        account,
        isDeploying,
        copyToClipboard,
        applyFromClipboard,
    };
};
