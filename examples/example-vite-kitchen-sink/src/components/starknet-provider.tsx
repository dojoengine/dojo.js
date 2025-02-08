import type { PropsWithChildren } from "react";
import { mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { env, getRpcUrl } from "@/env";
import {
    predeployedAccounts,
    PredeployedAccountsConnector,
} from "@dojoengine/predeployed-connector";

let pa: PredeployedAccountsConnector[] = [];
predeployedAccounts({
    rpc: env.VITE_CONTROLLER_RPC,
    id: "katana",
    name: "Katana",
}).then((p) => (pa = p));

export default function StarknetProvider({ children }: PropsWithChildren) {
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: getRpcUrl() }),
    });

    return (
        <StarknetConfig
            chains={[mainnet]}
            provider={provider}
            connectors={[...pa]}
            explorer={voyager}
            autoConnect
        >
            {children}
        </StarknetConfig>
    );
}
