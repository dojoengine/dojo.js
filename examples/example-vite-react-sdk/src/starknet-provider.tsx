import { usePredeployedAccounts } from "@dojoengine/predeployed-connector/react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import { dojoConfig } from "../dojoConfig";

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
