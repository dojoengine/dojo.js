import { RpcProvider, Account, Call } from "starknet";

// initialize provider
const provider = new RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });
// initialize existing pre-deployed account 0 of Devnet
const privateKey =
    "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
const accountAddress =
    "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";

const account0 = new Account(provider, accountAddress, privateKey);

const call: Call = {
    contractAddress:
        "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    entrypoint: "transfer",
    calldata: [
        "0x04c52be6a42ba0268BfbeE1b478D944FbF16d0228d90a23E8f3915dc2349D6E9",
        "100000000000000000000",
        "0",
    ],
};

account0.execute(call);
