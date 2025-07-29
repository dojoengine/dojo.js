import { usePredeployedAccounts } from "@dojoengine/predeployed-connector/react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import { getRpcUrl } from "@/env";
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
