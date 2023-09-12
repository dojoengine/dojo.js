import { useState, useEffect, useCallback, useMemo } from "react";
import { BurnerManager } from "../manager/burnerManager";
import { Account, AccountInterface } from "starknet";
import { Burner } from "../types";
import { BurnerConnector } from "..";

/**
 * Interface for the options required by the useBurner hook.
 */
export interface UseBurnerOptions {
    /** 
     * The Master account is what prefunds the Burner. 
     * Optional. Pass in an account that has funds if available.
     */
    masterAccount?: AccountInterface | Account;

    /** 
     * The class hash of the account you want to deploy.
     * This has to be predeployed on the chain you are deploying to.
     */
    accountClassHash: string;

    /** 
     * Node url
     */
    nodeUrl?: string;
}

/**
 * A React hook to manage Burner accounts.
 * Provides utility methods like get, list, select, and create.
 * 
 * @param options - Configuration options required for Burner operations.
 * @returns An object with utility methods and properties.
 */
export const useBurner = (options: UseBurnerOptions) => {
    // Initialize the BurnerManager with the provided options.
    const burnerManager = useMemo(() => new BurnerManager(options), [options]);
    // State to manage the current active account.
    const [account, setAccount] = useState<Account | null>(null);

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
    }, [options]);

    /**
     * Selects and sets a burner as the active account.
     * 
     * @param address - The address of the burner account to set as active.
     */
    const select = useCallback((address: string): void => {
        burnerManager.select(address);
        setAccount(burnerManager.getActiveAccount());
    }, [burnerManager, options]);

    /**
     * Retrieves a burner account based on its address.
     * 
     * @param address - The address of the burner account to retrieve.
     * @returns The Burner account corresponding to the provided address.
     */
    const get = useCallback((address: string): Account => {
        return burnerManager.get(address);
    }, [options]);

    /**
     * Creates a new burner account and sets it as the active account.
     * 
     * @returns A promise that resolves to the newly created Burner account.
     */
    const create = useCallback(async (): Promise<Account> => {
        const newAccount = await burnerManager.create();
        setAccount(newAccount);
        return newAccount;
    }, [burnerManager, options]);

    /**
     * Generates a list of BurnerConnector instances for each burner account. These can be added to Starknet React.
     *
     * @returns An array of BurnerConnector instances.
     */
    const listConnectors = useCallback((): BurnerConnector[] => {
        // Retrieve all the burners.
        const burners = list();

        // Map each burner to its respective BurnerConnector instance.
        return burners.map(burner => {
            return new BurnerConnector({
                options: {
                    id: burner.address,
                }
            }, get(burner.address));
        });
    }, [options, burnerManager.isDeploying]);

    // Expose methods and properties for the consumers of this hook.
    return {
        get,
        list,
        select,
        create,
        listConnectors,
        account,
        isDeploying: burnerManager.isDeploying,
    };
};