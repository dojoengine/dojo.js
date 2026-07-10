import type { PropsWithChildren } from "react";
import { devnet } from "@starknet-start/chains";
import { jsonRpcProvider } from "@starknet-start/providers";
import { StarknetConfig } from "@starknet-start/react";
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
    const katana = {
        ...devnet,
        id: BigInt("0x4b4154414e41"),
        name: "Katana",
        network: "katana",
        rpcUrls: {
            default: { http: [dojoConfig.rpcUrl as string] },
            public: { http: [dojoConfig.rpcUrl as string] },
        },
    };

    return (
        <StarknetConfig
            chains={[katana]}
            provider={provider}
            extraWallets={connectors}
        >
            {children}
        </StarknetConfig>
    );
}
