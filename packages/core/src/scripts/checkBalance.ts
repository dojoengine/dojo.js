#!/usr/bin/env node

import { Account, Call, RpcProvider } from "starknet";

if (
    process.env.ACCOUNT_PUBLIC_KEY === undefined ||
    process.env.ACCOUNT_ADDRESS === undefined ||
    process.env.ACCOUNT_PRIVATE_KEY === undefined ||
    process.env.ACCOUNT_CLASS_HASH === undefined ||
    process.env.NETWORK_FEE_TOKEN === undefined
) {
    throw new Error(
        "Please set ACCOUNT_PUBLIC_KEY, ACCOUNT_ADDRESS, and ACCOUNT_PRIVATE_KEY in .env file."
    );
}

export const provider = new RpcProvider({ nodeUrl: process.env.NODE_URL });

const newAccount = new Account(
    provider,
    process.env.ACCOUNT_ADDRESS,
    process.env.ACCOUNT_PRIVATE_KEY,
    "1"
);

const balance: Call = {
    contractAddress: process.env.NETWORK_FEE_TOKEN,
    entrypoint: "balance_of",
    calldata: [process.env.ACCOUNT_ADDRESS],
};

await newAccount.callContract(balance);
