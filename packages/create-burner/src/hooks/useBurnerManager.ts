import { useCallback, useEffect, useState } from "react";
import { Account, AccountInterface, InvocationsDetails } from "starknet";
import { BurnerConnector } from "..";
import { BurnerManager } from "../manager/burnerManager";
import { Burner, BurnerCreateOptions, BurnerManagerHook } from "../types";

/**
 * A React hook that takes the Burner Manager object avoiding the React Context.
 * Useful for building apps without React Context.
 *
 * @returns An object with utility methods and properties.
 */
export const useBurnerManager = ({
    burnerManager,
}: {
    burnerManager: BurnerManager | null; // Accepts the BurnerManager class as an parameter
}): BurnerManagerHook => {
    const [isError, setIsError] = useState(false);

    // State to manage the current active account.
    const [account, setAccount] = useState<AccountInterface | null>(null);
    const [count, setCount] = useState(0);
    const [isDeploying, setIsDeploying] = useState(false);

    // On mount, set the active account and count the number of burners.
    // - if burnerManager not null, it has to be initialized before the component mounts
    // - otherwise (if null) set account to null and count to 0, meaning we don't
    // have master account yet to create a burner or in case when the game rpc is unavailable,
    // its impossible to create a valid Burner Manager and will result in client error
    useEffect(() => {
        if (!burnerManager) {
            console.log(
                "BurnerManager object is null, setting account to null and count to 0."
            );
            setAccount(null);
            setCount(0);
            return;
        }
        if (!burnerManager.isInitialized) {
            throw new Error("BurnerManager must be initialized");
        }
        if (!burnerManager.masterAccount) {
            throw new Error("BurnerManager Master Account must be provided");
        }
        setIsError(false);

        setAccount(burnerManager.getActiveAccount());
        setCount(burnerManager.list().length);
    }, [burnerManager]);

    /**
     * Lists all the burners available in the storage.
     *
     * @returns An array of Burner accounts.
     */
    const list = useCallback((): Burner[] => {
        return burnerManager ? burnerManager.list() : [];
    }, [count, burnerManager]);

    /**
     * Selects and sets a burner as the active account.
     *
     * @param address - The address of the burner account to set as active.
     */
    const select = useCallback(
        (address: string): void => {
            burnerManager?.select(address);
            setAccount(burnerManager?.getActiveAccount() ?? null);
        },
        [burnerManager]
    );

    /**
     * Deselects the active burner, account will be set to null. Useful to allow guests.
     */
    const deselect = useCallback((): void => {
        burnerManager?.deselect();
        setAccount(null);
    }, [burnerManager]);

    /**
     * Retrieves a burner account based on its address.
     *
     * @param address - The address of the burner account to retrieve.
     * @returns The Burner account corresponding to the provided address.
     */
    const get = useCallback(
        (address: string): Account | undefined => {
            return burnerManager?.get(address);
        },
        [burnerManager]
    );

    /**
     * Deletes a burner account based on its address.
     *
     * @param address - The address of the burner account to delete.
     */
    const remove = useCallback(
        async (
            address: string,
            transactionDetails?: InvocationsDetails
        ): Promise<void> => {
            if (burnerManager) {
                await burnerManager.delete(address, transactionDetails);
                setCount((prev) => Math.max(prev - 1, 0));
                setAccount(burnerManager.account);
            }
        },
        [burnerManager]
    );

    /**
     * Clears a burner account based on its address.
     */
    const clear = useCallback(
        async (transactionDetails?: InvocationsDetails) => {
            if (burnerManager) {
                await burnerManager.clear(transactionDetails);
                setCount(0);
                setAccount(null);
            }
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
        async (options?: BurnerCreateOptions): Promise<Account | undefined> => {
            if (burnerManager) {
                burnerManager.setIsDeployingCallback(setIsDeploying);
                const newAccount = await burnerManager.create(options);
                setAccount(newAccount);
                setCount((prev) => prev + 1);
                return newAccount;
            }
        },
        [burnerManager]
    );

    /**
     * Generates a list of BurnerConnector instances for each burner account. These can be added to Starknet React.
     *
     * @returns An array of BurnerConnector instances.
     */
    const listConnectors = useCallback((): BurnerConnector[] => {
        const burners = list(); // List all burners
        return burners
            .map((burner) => {
                const account = get(burner.address); // Attempt to get the account
                if (!account) return null; // If account is undefined, skip this burner
                return new BurnerConnector(
                    {
                        id: burner.address,
                        name: "Dojo Burner",
                    },
                    account // This is now guaranteed to be a valid Account
                );
            })
            .filter((connector) => connector !== null) as BurnerConnector[]; // Filter out nulls and cast the result to ensure type correctness
    }, [burnerManager?.isDeploying, list, get]);

    /**
     * Copy burners to clipboard
     */
    const copyToClipboard = useCallback(async () => {
        if (burnerManager) {
            await burnerManager.copyBurnersToClipboard();
        }
    }, [burnerManager]);

    /**
     * Set burners from clipboard
     */
    const applyFromClipboard = useCallback(async () => {
        if (burnerManager) {
            await burnerManager.setBurnersFromClipboard();
            setAccount(burnerManager.getActiveAccount());
            setCount(burnerManager.list().length);
        }
    }, [burnerManager]);

    /**
     * Returns a deterministic account addresses based on a seed and index.
     *
     * @param options - (optional) account secret seed and index
     * @returns A deterministic Burner address
     */
    const generateAddressFromSeed = useCallback(
        (options?: BurnerCreateOptions): string | undefined => {
            if (burnerManager) {
                const { address } =
                    burnerManager.generateKeysAndAddress(options);
                return address;
            }
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
