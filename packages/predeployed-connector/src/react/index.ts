import { useEffect } from "react";
import { useState } from "react";
import {
    predeployedAccounts,
    type PredeployedAccountsConnector,
    type PredeployedAccountsConnectorOptions,
} from "..";

/**
 * Hook for fetching predeployed accounts.
 *
 * @param options - The options for the predeployed accounts.
 * @returns The predeployed accounts.
 */
export function usePredeployedAccounts(
    options: PredeployedAccountsConnectorOptions
) {
    const [retries, setRetries] = useState<number>(0);
    const [connectors, setConnectors] = useState<
        PredeployedAccountsConnector[]
    >([]);

    useEffect(() => {
        if (connectors.length === 0 && retries < 5) {
            setRetries(retries + 1);
            predeployedAccounts(options).then(setConnectors);
        }
    }, [connectors, options]);

    return { connectors };
}
