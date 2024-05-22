import { jsonRpcProvider } from "@starknet-react/core";
import { Chain } from "@starknet-react/chains";
import { dojoConfig } from "../dojoConfig";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";

export const katana: Chain = {
    id: BigInt(420),
    network: "katana",
    name: "Katana Devnet",
    nativeCurrency: {
        address: KATANA_ETH_CONTRACT_ADDRESS,
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
