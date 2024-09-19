import { useCallback, useEffect, useState } from "react";
import { Account } from "starknet";

import { BurnerConnector } from "..";
import { BurnerManager } from "../manager/burnerManager";
import { Burner, BurnerCreateOptions } from "../types";

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
    const [isError, setIsError] = useState(false);

    // State to manage the current active account.
    const [account, setAccount] = useState<Account | null>(null);
    const [count, setCount] = useState(0);
    const [isDeploying, setIsDeploying] = useState(false);

    // On mount, set the active account and count the number of burners.
    // burnerManager has to be initialized before the component mounts
    useEffect(() => {
        // allow null burner manager
        // when the game rpc is unavailable, its impossible to create a valid Burner Manager and will result in client error
        if (!burnerManager) {
            setIsError(true);
            console.error("BurnerManager object must be provided");
            return;
        }
        if (!burnerManager.isInitialized) {
            throw new Error("BurnerManager must be intialized");
        }
        if (!burnerManager.masterAccount) {
            throw new Error("BurnerManager Master Account must be provided");
        }
        setIsError(false);
        (async () => {
            setAccount(burnerManager.getActiveAccount());
            setCount(burnerManager.list().length);
        })();
    }, [burnerManager]);

    /**
     * Lists all the burners available in the storage.
     *
     * @returns An array of Burner accounts.
     */
    const list = useCallback((): Burner[] => {
        return burnerManager?.list() ?? [];
    }, [count]);

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
     * Deselects the active burner, account will be set to null. Useful to allow guests.
     */
    const deselect = useCallback((): void => {
        burnerManager.deselect();
        setAccount(null);
    }, [burnerManager]);

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
     * Deletes a burner account based on its address.
     *
     * @param address - The address of the burner account to delete.
     */
    const remove = useCallback(
        (address: string): void => {
            burnerManager.delete(address);
            setCount((prev) => Math.max(prev - 1, 0));
        },
        [burnerManager]
    );

    /**
     * Clears a burner account based on its address.
     */
    const clear = useCallback(() => {
        burnerManager.clear();
        setCount(0);
    }, [burnerManager]);

    /**
     * Checks if an account has been deployed.
     *
     * @param address - The address of the burner account to check.
     * @param deployTx - Optional deployment transaction hash.
     * @returns True if account has been deployed.
     */
    const checkIsDeployed = useCallback(
        async (address: string, deployTx?: string): Promise<boolean> => {
            return burnerManager.isBurnerDeployed(address, deployTx);
        },
        [burnerManager]
    );

    /**
     * Creates a new burner account and sets it as the active account.
     *
     * @param options - (optional) secret seed and index for deterministic accounts.
     * @returns A promise that resolves to the newly created Burner account.
     */
    const create = useCallback(
        async (options?: BurnerCreateOptions): Promise<Account> => {
            burnerManager.setIsDeployingCallback(setIsDeploying);
            const newAccount = await burnerManager.create(options);
            setAccount(newAccount);
            setCount((prev) => prev + 1);
            return newAccount;
        },
        [burnerManager]
    );

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
                    id: burner.address,
                    name: "Dojo Burner",
                },
                get(burner.address)
            );
        });
    }, [burnerManager?.isDeploying]);

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
        setAccount(burnerManager.getActiveAccount());
        setCount(burnerManager.list().length);
    }, [burnerManager]);

    /**
     * Returns a deterministic account addresses based on a seed and index.
     *
     * @param options - (optional) account secret seed and index
     * @returns A deterministic Burner address
     */
    const generateAddressFromSeed = useCallback(
        (options?: BurnerCreateOptions): string => {
            const { address } = burnerManager.generateKeysAndAddress(options);
            return address;
        },
        [burnerManager]
    );

    return {
        isError,
        get,
        list,
        select,
        deselect,
        remove,
        checkIsDeployed,
        create,
        listConnectors,
        clear,
        account,
        isDeploying,
        count,
        copyToClipboard,
        applyFromClipboard,
        generateAddressFromSeed,
    };
};
