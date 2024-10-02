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
import { dojoConfig } from "@/dojo.config";

const cartridge = new CartridgeConnector({
  url: env.VITE_CONTROLLER_URL,
  rpc: env.VITE_CONTROLLER_RPC,
  policies: [
    {
      target: dojoConfig.manifest.contracts[0].address,
      method: 'increment_caller_counter',
    },
    {
      target: dojoConfig.manifest.contracts[0].address,
      method: 'increment_global_counter',
    },
    {
      target: dojoConfig.manifest.contracts[0].address,
      method: 'change_theme',
    },
  ]
});

export default function StarknetProvider({ children }: PropsWithChildren) {
  const provider = jsonRpcProvider({
    rpc: (
      chain: Chain
    ) => ({ nodeUrl: getRpcUrl() })
  });

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={[
        cartridge,
      ]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
