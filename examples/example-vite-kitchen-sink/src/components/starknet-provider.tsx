import type { PropsWithChildren } from "react";
import CartridgeConnector from "@cartridge/connector";
import { Chain, mainnet } from "@starknet-react/chains";
import {
  argent,
  braavos,
  jsonRpcProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { env, getRpcUrl } from "@/env";

export default function StarknetProvider({ children }: PropsWithChildren) {
  const provider = jsonRpcProvider({
    rpc: (
      chain: Chain
    ) => ({ nodeUrl: getRpcUrl() })
  });
  const { connectors: injectedConnectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "alphabetical",
  });

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={[
        new CartridgeConnector({
          url: env.VITE_CONTROLLER_URL,
          rpc: env.VITE_CONTROLLER_RPC,

        }),
        ...injectedConnectors,
      ]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
