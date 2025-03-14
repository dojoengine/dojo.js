import type { PropsWithChildren } from "react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { getRpcUrl } from "@/env";
import { usePredeployedAccounts } from "@dojoengine/predeployed-connector/react";
import { dojoConfig } from "../../dojoConfig";

export default function StarknetProvider({ children }: PropsWithChildren) {
    const { connectors } = usePredeployedAccounts({
        rpc: dojoConfig.rpcUrl as string,
        id: "katana",
        name: "Katana",
    });
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: getRpcUrl() }),
    });

    return (
        <StarknetConfig
            chains={[mainnet]}
            provider={provider}
            connectors={[...connectors]}
            explorer={voyager}
            autoConnect
        >
            {children}
        </StarknetConfig>
    );
}
