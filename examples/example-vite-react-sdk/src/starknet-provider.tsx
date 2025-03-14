import type { PropsWithChildren } from "react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { dojoConfig } from "../dojoConfig";
import { usePredeployedAccounts } from "@dojoengine/predeployed-connector/react";

export default function StarknetProvider({ children }: PropsWithChildren) {
    const { connectors } = usePredeployedAccounts({
        rpc: dojoConfig.rpcUrl as string,
        id: "katana",
        name: "Katana",
    });

    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: dojoConfig.rpcUrl as string }),
    });

    return (
        <StarknetConfig
            chains={[mainnet]}
            provider={provider}
            connectors={connectors}
            explorer={voyager}
            autoConnect
        >
            {/* @ts-ignore react version mismatch */}
            {children}
        </StarknetConfig>
    );
}
