import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Account } from "starknet";
import { BurnerConnector, BurnerManager } from "..";
import { BurnerContext } from "../context";
import { Burner } from "../types";

/**
 * A React hook to manage Burner accounts.
 * This hook exposes methods and properties to manage Burner accounts.
 * You need to use this within a {@link BurnerProvider} context.
 *
 * @example
 * ```tsx
 * import { useBurner } from "@dojoengine/create-burner";
 *
 * const MyComponent = () => {
 *   const { list, select, create } = useBurner();
 * const burners = list();
 *
 *   return (
 *     <div>
 *       <button onClick={() => create()}>Create Burner</button>
 *     {burners.map((burner) => (
 *       <button key={burner.address} onClick={() => select(burner.address)}>
 *         Select Burner
 *       </button>
 *    ))}
 *  </div>
 *  );
 * };
 * ```
 *
 * @returns An object with utility methods and properties.
 */
export const useBurner = () => {
    const initParams = useContext(BurnerContext);

    if (!initParams) {
        throw new Error("useBurner must be used within a BurnerProvider");
    }

    /** Initialize the BurnerManager with the provided options. */
    const burnerManager = useMemo(
        () => new BurnerManager(initParams),
        [initParams]
    );

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
        setAccount(burnerManager.getActiveAccount()); // set the active account
        setBurnerUpdate((prev) => prev + 1); // re-fetch of the list
    }, [burnerManager]);

    // Expose methods and properties for the consumers of this hook.
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
