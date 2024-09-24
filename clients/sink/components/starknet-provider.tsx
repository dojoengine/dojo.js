"use client";

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

export default function StarknetProvider({ children }: PropsWithChildren) {
  const provider = jsonRpcProvider({
    rpc: (
      chain: Chain
    ) => ({ nodeUrl: "http://localhost:5050" })
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
          rpc: "http://localhost:5050",
          url: "http://localhost:3001",

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
