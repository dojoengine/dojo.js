import { RpcProvider, Account, CallData } from "starknet";

// Deploy Argent Account without using the Argent deployer

// initialize provider
const provider = new RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

const privateKey = "";
const accountAddress = "";

const account0 = new Account(provider, accountAddress, privateKey, "1");

const accountOptions = {
    classHash:
        "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
    constructorCalldata: CallData.compile({
        publicKey:
            "2405339549181282770144876339490947571198550213801119528626155440700515171969",
    }),
    addressSalt:
        "2405339549181282770144876339490947571198550213801119528626155440700515171969",
};

await account0.deployAccount(accountOptions, {
    nonce: 1,
    maxFee: 0, // TODO: update
});
