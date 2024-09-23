"use client";

import type { PropsWithChildren } from "react";
import CartridgeConnector from "@cartridge/connector";
import { mainnet } from "@starknet-react/chains";
import {
  argent,
  braavos,
  nethermindProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: PropsWithChildren) {
  const provider = nethermindProvider({
    apiKey: "KZvWx3liaWO5LFZqYYZ5iS9dWlvgmH7caKH7bARF6Uw6U0jqvRvOu8BjFOVvFxWX",
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
          rpc: "https://api.cartridge.gg/x/starknet/mainnet",
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
