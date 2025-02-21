import { useEffect, useState, type PropsWithChildren } from "react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { dojoConfig } from "../dojoConfig";
import {
    predeployedAccounts,
    type PredeployedAccountsConnector,
} from "@dojoengine/predeployed-connector";

export default function StarknetProvider({ children }: PropsWithChildren) {
    const [retries, setRetries] = useState<number>(0);
    const [connectors, setConnectors] = useState<
        PredeployedAccountsConnector[]
    >([]);
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: dojoConfig.rpcUrl as string }),
    });

    useEffect(() => {
        if (connectors.length === 0 && retries < 5) {
            setRetries(retries + 1);
            predeployedAccounts({
                rpc: dojoConfig.rpcUrl as string,
                id: "katana",
                name: "Katana",
            }).then(setConnectors);
        }
    }, [connectors]);

    return (
        <StarknetConfig
            chains={[mainnet]}
            provider={provider}
            connectors={connectors}
            explorer={voyager}
            autoConnect
        >
            {children}
        </StarknetConfig>
    );
}
