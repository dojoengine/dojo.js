import { jsonRpcProvider } from "@starknet-react/core";
import { Chain } from "@starknet-react/chains";
import { dojoConfig } from "../dojoConfig";

export const katana: Chain = {
    id: BigInt(420),
    network: "katana",
    name: "Katana Devnet",
    nativeCurrency: {
        address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    testnet: true,
    rpcUrls: {
        default: {
            http: [],
        },
        public: {
            http: ["http://localhost:5050"],
        },
    },
};

function rpc(chain: Chain) {
    return {
        nodeUrl: dojoConfig.rpcUrl,
    };
}

export const provider = jsonRpcProvider({ rpc });
